import type jsPDF from "jspdf";
import type { Protocol } from "../types";

const MARGIN_X = 48;
const HEADER_HEIGHT = 96;
const FOOTER_ZONE = 56;
const IMG_BOX = 100;
const IMG_GAP = 10;

const HEADER_BG: [number, number, number] = [20, 83, 45];
const HEADER_ACCENT: [number, number, number] = [34, 197, 94];
const SECTION_TITLE: [number, number, number] = [21, 87, 58];
const BODY_TEXT: [number, number, number] = [45, 50, 47];
const MUTED_TEXT: [number, number, number] = [120, 138, 128];
const BULLET_GREEN: [number, number, number] = [34, 197, 94];
const RULE_GREEN: [number, number, number] = [200, 230, 212];
const IMAGE_BORDER: [number, number, number] = [190, 222, 201];

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

async function renderProtocolPdf(
  doc: jsPDF,
  protocol: Protocol,
  studentName: string,
  schoolClass?: string,
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - MARGIN_X * 2;
  const pageBottom = pageHeight - FOOTER_ZONE;
  let y = HEADER_HEIGHT + 34;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageBottom) {
      doc.addPage();
      doc.setDrawColor(...RULE_GREEN);
      doc.setLineWidth(2);
      doc.line(MARGIN_X, 36, pageWidth - MARGIN_X, 36);
      y = 64;
    }
  }

  function sectionHeading(title: string) {
    ensureSpace(26);
    doc.setFillColor(...BULLET_GREEN);
    doc.roundedRect(MARGIN_X, y - 9, 9, 9, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...SECTION_TITLE);
    doc.text(title, MARGIN_X + 16, y);
    y += 8;
    doc.setDrawColor(...RULE_GREEN);
    doc.setLineWidth(1);
    doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y);
    y += 16;
  }

  function paragraph(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...BODY_TEXT);
    const wrapped: string[] = doc.splitTextToSize(text, maxWidth);
    for (const line of wrapped) {
      ensureSpace(16);
      doc.text(line, MARGIN_X, y);
      y += 16;
    }
    y += 10;
  }

  function bulletList(items: string[]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const indent = 16;
    for (const raw of items) {
      const wrapped: string[] = doc.splitTextToSize(raw, maxWidth - indent);
      ensureSpace(16);
      doc.setFillColor(...BULLET_GREEN);
      doc.circle(MARGIN_X + 3, y - 3.5, 2.6, "F");
      doc.setTextColor(...BODY_TEXT);
      doc.text(wrapped[0], MARGIN_X + indent, y);
      y += 16;
      for (const line of wrapped.slice(1)) {
        ensureSpace(16);
        doc.text(line, MARGIN_X + indent, y);
        y += 16;
      }
    }
    y += 10;
  }

  function numberedList(items: string[]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const indent = 22;
    items.forEach((raw, i) => {
      const wrapped: string[] = doc.splitTextToSize(raw, maxWidth - indent);
      ensureSpace(18);
      doc.setFillColor(...BULLET_GREEN);
      doc.circle(MARGIN_X + 6, y - 4, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(String(i + 1), MARGIN_X + 6, y - 1.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...BODY_TEXT);
      doc.text(wrapped[0], MARGIN_X + indent, y);
      y += 16;
      for (const line of wrapped.slice(1)) {
        ensureSpace(16);
        doc.text(line, MARGIN_X + indent, y);
        y += 16;
      }
    });
    y += 10;
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
        const w = width * scale;
        const h = height * scale;
        doc.setDrawColor(...IMAGE_BORDER);
        doc.setLineWidth(1.5);
        doc.roundedRect(x - 1.5, y - 1.5, w + 3, h + 3, 4, 4, "S");
        doc.addImage(src, "JPEG", x, y, w, h);
      } catch {
        // skip images that fail to load
      }
      x += IMG_BOX + IMG_GAP;
    }
    y += IMG_BOX + 16;
  }

  // Header banner
  doc.setFillColor(...HEADER_BG);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");
  doc.setFillColor(...HEADER_ACCENT);
  doc.circle(pageWidth - 46, 30, 26, "F");
  doc.setFillColor(...HEADER_BG);
  doc.circle(pageWidth - 46, 30, 18, "F");
  doc.setFillColor(...HEADER_ACCENT);
  doc.circle(pageWidth - 70, 62, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text("Experiment-Protokoll", MARGIN_X, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(205, 235, 215);
  const dateLabel = new Date(protocol.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const subtitle = [studentName, schoolClass ? `Klasse ${schoolClass}` : null, dateLabel]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(subtitle, MARGIN_X, 68);

  sectionHeading("Fragestellung");
  paragraph(protocol.question);
  await images(protocol.images.question);

  sectionHeading("Materialien");
  bulletList(protocol.materials);
  await images(protocol.images.materials);

  sectionHeading("Durchführung");
  numberedList(protocol.procedure);
  await images(protocol.images.procedure);

  if (protocol.hypothesis || protocol.images.hypothesis.length > 0) {
    sectionHeading("Vermutung");
    if (protocol.hypothesis) paragraph(protocol.hypothesis);
    await images(protocol.images.hypothesis);
  }

  sectionHeading("Beobachtung");
  paragraph(protocol.observation);
  await images(protocol.images.observation);

  sectionHeading("Ergebnis");
  paragraph(protocol.result);
  await images(protocol.images.result);

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...RULE_GREEN);
    doc.setLineWidth(1);
    doc.line(MARGIN_X, pageHeight - 34, pageWidth - MARGIN_X, pageHeight - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_TEXT);
    doc.text("Erstellt mit LabNote", MARGIN_X, pageHeight - 20);
    doc.text(`Seite ${i} von ${pageCount}`, pageWidth - MARGIN_X, pageHeight - 20, {
      align: "right",
    });
  }
}

async function buildPdf(protocol: Protocol, studentName: string, schoolClass?: string) {
  const { default: JsPDF } = await import("jspdf");
  const doc = new JsPDF({ unit: "pt", format: "a4" });
  await renderProtocolPdf(doc, protocol, studentName, schoolClass);
  const fileName = `Protokoll-${slugify(protocol.question)}.pdf`;
  return { doc, fileName };
}

export type SubmitResult = "shared" | "downloaded" | "cancelled";

export async function submitProtocolAsPdf(
  protocol: Protocol,
  studentName: string,
  schoolClass?: string,
): Promise<SubmitResult> {
  const { doc, fileName } = await buildPdf(protocol, studentName, schoolClass);

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

export async function openProtocolPdf(
  protocol: Protocol,
  studentName: string,
  schoolClass?: string,
): Promise<void> {
  const { doc } = await buildPdf(protocol, studentName, schoolClass);
  const url = doc.output("bloburl");
  window.open(url, "_blank");
}
