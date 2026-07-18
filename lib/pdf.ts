import PDFDocument from "pdfkit";
import type { AuditReport } from "./audit";

function section(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(1.2).fontSize(17).fillColor("#1d3445").text(title);
  doc.moveDown(0.4).fontSize(10.5).fillColor("#222222");
}

function bullets(doc: PDFKit.PDFDocument, items: string[]) {
  for (const item of items) {
    doc.text(`• ${item}`, { indent: 12, paragraphGap: 6 });
  }
}

export async function buildPdf(report: AuditReport, businessName: string, website: string): Promise<Buffer> {
  const doc = new PDFDocument({ size: "LETTER", margin: 54, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));

  doc.fontSize(28).fillColor("#102534").text("Revenue Rescue Audit");
  doc.moveDown(0.4).fontSize(16).fillColor("#5b6973").text(businessName);
  doc.fontSize(10).text(website);
  doc.moveDown(2).fontSize(11).fillColor("#222222").text(report.title);

  section(doc, "Executive Summary");
  doc.text(report.executiveSummary, { lineGap: 3 });

  section(doc, "Priority Findings");
  report.findings.forEach((finding, index) => {
    doc.fontSize(12.5).fillColor("#102534").text(`${index + 1}. ${finding.title} — ${finding.priority}`);
    doc.fontSize(10).fillColor("#444444").text(`Evidence: ${finding.evidence}`, { indent: 10 });
    doc.text(`Recommendation: ${finding.recommendation}`, { indent: 10 });
    doc.text(`Expected impact: ${finding.expectedImpact}`, { indent: 10, paragraphGap: 9 });
  });

  section(doc, "Pricing and Offer");
  bullets(doc, report.pricingAndOffer);

  section(doc, "Messaging Improvements");
  bullets(doc, report.messaging);

  section(doc, "Automation Opportunities");
  bullets(doc, report.automationOpportunities);

  section(doc, "30-Day Roadmap");
  bullets(doc, report.roadmap30);

  section(doc, "60-Day Roadmap");
  bullets(doc, report.roadmap60);

  section(doc, "90-Day Roadmap");
  bullets(doc, report.roadmap90);

  section(doc, "Limitations");
  doc.text(report.limitations);
  doc.moveDown(1);
  doc.fontSize(8.5).fillColor("#666666").text(
    "This report is based on publicly accessible website content and customer-provided information. It is not legal, accounting, or financial advice and does not guarantee revenue results."
  );

  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor("#777777").text(
      `Revenue Rescue • Page ${i + 1} of ${range.count}`,
      54,
      doc.page.height - 34,
      { align: "center", width: doc.page.width - 108 }
    );
  }

  doc.end();
  await new Promise<void>((resolve, reject) => {
    doc.on("end", resolve);
    doc.on("error", reject);
  });
  return Buffer.concat(chunks);
}
