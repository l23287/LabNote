import type jsPDF from "jspdf";
import type { Protocol } from "../types";

const MARGIN_X = 48;
const PAGE_BOTTOM = 780;

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

function renderProtocolPdf(doc: jsPDF, protocol: Protocol, studentName: string) {
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
    y += 14;
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
  section("Materialien", protocol.materials);
  section("Durchführung", protocol.procedure, true);
  if (protocol.hypothesis) section("Vermutung", [protocol.hypothesis]);
  section("Beobachtung", [protocol.observation]);
  section("Ergebnis", [protocol.result]);
}

export type SubmitResult = "shared" | "downloaded" | "cancelled";

export async function submitProtocolAsPdf(
  protocol: Protocol,
  studentName: string,
): Promise<SubmitResult> {
  const { default: JsPDF } = await import("jspdf");
  const doc = new JsPDF({ unit: "pt", format: "a4" });
  renderProtocolPdf(doc, protocol, studentName);
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
