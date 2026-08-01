import type jsPDF from "jspdf";
import type { Protocol } from "../types";

const MARGIN_X = 50;
const FOOTER_ZONE = 50;
const IMG_BOX = 100;
const IMG_GAP = 10;

const ACCENT: [number, number, number] = [27, 67, 50];
const HEADING_TEXT: [number, number, number] = [27, 67, 50];
const BODY_TEXT: [number, number, number] = [40, 40, 40];
const MUTED_TEXT: [number, number, number] = [130, 130, 130];
const RULE_GRAY: [number, number, number] = [214, 214, 214];
const IMAGE_BORDER: [number, number, number] = [214, 214, 214];

const HEADER_BG: [number, number, number] = [21, 74, 53];
const HEADER_EYEBROW: [number, number, number] = [163, 214, 182];
const HEADER_META: [number, number, number] = [200, 225, 210];

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

  // --- Header: green banner with the research question as the title ---
  const HEADER_TOP = 32;
  const EYEBROW_GAP = 20;
  const TITLE_LINE_H = 24;
  const TITLE_META_GAP = 16;
  const HEADER_BOTTOM_PAD = 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  const titleLines: string[] = doc.splitTextToSize(protocol.question || "Ohne Titel", maxWidth);

  const headerHeight =
    HEADER_TOP +
    EYEBROW_GAP +
    titleLines.length * TITLE_LINE_H +
    TITLE_META_GAP +
    HEADER_BOTTOM_PAD;

  doc.setFillColor(...HEADER_BG);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...HEADER_EYEBROW);
  doc.text("EXPERIMENT-PROTOKOLL", MARGIN_X, HEADER_TOP);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  let titleY = HEADER_TOP + EYEBROW_GAP;
  for (const line of titleLines) {
    doc.text(line, MARGIN_X, titleY);
    titleY += TITLE_LINE_H;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...HEADER_META);
  const dateLabel = new Date(protocol.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const metaParts = [
    `Name: ${studentName}`,
    schoolClass ? `Klasse: ${schoolClass}` : null,
    `Datum: ${dateLabel}`,
  ].filter(Boolean);
  doc.text(metaParts.join("   |   "), MARGIN_X, titleY - TITLE_LINE_H + TITLE_META_GAP);

  let y = headerHeight + 34;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageBottom) {
      doc.addPage();
      y = 60;
    }
  }

  function sectionHeading(title: string) {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...HEADING_TEXT);
    doc.text(title.toUpperCase(), MARGIN_X, y);
    y += 7;
    doc.setDrawColor(...RULE_GRAY);
    doc.setLineWidth(0.75);
    doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y);
    y += 18;
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
    y += 12;
  }

  function bulletList(items: string[]) {
    const indent = 14;
    for (const raw of items) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const wrapped: string[] = doc.splitTextToSize(raw, maxWidth - indent);
      ensureSpace(16);
      doc.setTextColor(...ACCENT);
      doc.text("–", MARGIN_X, y);
      doc.setTextColor(...BODY_TEXT);
      doc.text(wrapped[0], MARGIN_X + indent, y);
      y += 16;
      for (const line of wrapped.slice(1)) {
        ensureSpace(16);
        doc.text(line, MARGIN_X + indent, y);
        y += 16;
      }
    }
    y += 12;
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
        doc.setLineWidth(0.75);
        doc.rect(x - 1, y - 1, w + 2, h + 2, "S");
        doc.addImage(src, "JPEG", x, y, w, h);
      } catch {
        // skip images that fail to load
      }
      x += IMG_BOX + IMG_GAP;
    }
    y += IMG_BOX + 16;
  }

  if (protocol.images.question.length > 0) {
    await images(protocol.images.question);
  }

  sectionHeading("Materialien");
  bulletList(protocol.materials);
  await images(protocol.images.materials);

  sectionHeading("Durchführung");
  paragraph(protocol.procedure);
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
    doc.setDrawColor(...RULE_GRAY);
    doc.setLineWidth(0.75);
    doc.line(MARGIN_X, pageHeight - 32, pageWidth - MARGIN_X, pageHeight - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_TEXT);
    doc.text("LabNote", MARGIN_X, pageHeight - 18);
    doc.text(`Seite ${i} von ${pageCount}`, pageWidth - MARGIN_X, pageHeight - 18, {
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
