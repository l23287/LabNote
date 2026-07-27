import type jsPDF from "jspdf";
import type { Protocol } from "../types";

const MARGIN_X = 48;
const PAGE_BOTTOM = 780;
const IMG_BOX = 100;
const IMG_GAP = 10;

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return slug || "experiment";
}

function loadImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Bild konnte nicht geladen werden."));
    img.src = dataUrl;
  });
}

async function renderProtocolPdf(doc: jsPDF, protocol: Protocol, studentName: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - MARGIN_X * 2;
  let y = 64;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > PAGE_BOTTOM) {
      doc.addPage();
      y = 64;
    }
  }

  function section(title: string, lines: string[], ordered = false) {
    if (lines.length === 0) return;
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 60, 45);
    doc.text(title, MARGIN_X, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    for (const [i, raw] of lines.entries()) {
      const prefix = ordered ? `${i + 1}. ` : lines.length > 1 ? "• " : "";
      const wrapped: string[] = doc.splitTextToSize(`${prefix}${raw}`, maxWidth);
      for (const line of wrapped) {
        ensureSpace(16);
        doc.text(line, MARGIN_X, y);
        y += 16;
      }
    }
    y += 6;
  }

  function sectionTitle(title: string) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 60, 45);
    doc.text(title, MARGIN_X, y);
    y += 20;
  }

  async function images(imgs: string[]) {
    if (imgs.length === 0) return;
    ensureSpace(IMG_BOX);
    let x = MARGIN_X;

    for (const src of imgs) {
      if (x + IMG_BOX > MARGIN_X + maxWidth) {
        x = MARGIN_X;
        y += IMG_BOX + IMG_GAP;
        ensureSpace(IMG_BOX);
      }
      try {
        const { width, height } = await loadImageSize(src);
        const scale = Math.min(IMG_BOX / width, IMG_BOX / height);
        doc.addImage(src, "JPEG", x, y, width * scale, height * scale);
      } catch {
        // skip images that fail to load
      }
      x += IMG_BOX + IMG_GAP;
    }
    y += IMG_BOX + 14;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 60, 45);
  doc.text("Experiment-Protokoll", MARGIN_X, y);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const dateLabel = new Date(protocol.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`${studentName} · ${dateLabel}`, MARGIN_X, y);
  y += 28;

  section("Fragestellung", [protocol.question]);
  await images(protocol.images.question);
  section("Materialien", protocol.materials);
  await images(protocol.images.materials);
  section("Durchführung", protocol.procedure, true);
  await images(protocol.images.procedure);
  if (protocol.hypothesis) {
    section("Vermutung", [protocol.hypothesis]);
    await images(protocol.images.hypothesis);
  } else if (protocol.images.hypothesis.length > 0) {
    sectionTitle("Vermutung");
    await images(protocol.images.hypothesis);
  }
  section("Beobachtung", [protocol.observation]);
  await images(protocol.images.observation);
  section("Ergebnis", [protocol.result]);
  await images(protocol.images.result);
}

export type SubmitResult = "shared" | "downloaded" | "cancelled";

export async function submitProtocolAsPdf(
  protocol: Protocol,
  studentName: string,
): Promise<SubmitResult> {
  const { default: JsPDF } = await import("jspdf");
  const doc = new JsPDF({ unit: "pt", format: "a4" });
  await renderProtocolPdf(doc, protocol, studentName);
  const fileName = `Protokoll-${slugify(protocol.question)}.pdf`;

  if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
    const blob = doc.output("blob");
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Experiment-Protokoll",
        });
        return "shared";
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return "cancelled";
        }
        // fall through to plain download for any other share failure
      }
    }
  }

  doc.save(fileName);
  return "downloaded";
}
