import { Resend } from "resend";
import { requiredEnv } from "./config";

export async function sendAuditEmail(to: string, businessName: string, pdf: Buffer) {
  const resend = new Resend(requiredEnv("RESEND_API_KEY"));
  const from = requiredEnv("FROM_EMAIL");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Your Revenue Rescue Audit — ${businessName}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17212b">
        <h1>Your audit is ready</h1>
        <p>Attached is the completed Revenue Rescue Audit for <strong>${escapeHtml(businessName)}</strong>.</p>
        <p>Start with the critical findings and the 30-day roadmap. Those sections contain the highest-priority actions.</p>
        <p>Revenue Rescue</p>
      </div>
    `,
    attachments: [
      {
        content: pdf.toString("base64"),
        filename: "revenue-rescue-audit.pdf"
      }
    ]
  });

  if (error) throw new Error(`Resend delivery failed: ${error.message}`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char] || char));
}
