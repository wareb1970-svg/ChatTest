import OpenAI from "openai";
import { requiredEnv } from "./config";

export type AuditInput = {
  name: string;
  email: string;
  businessName: string;
  website: string;
  challenge: string;
  notes?: string;
  websiteText: string;
};

export type AuditReport = {
  title: string;
  executiveSummary: string;
  findings: Array<{
    priority: "Critical" | "High" | "Medium";
    title: string;
    evidence: string;
    recommendation: string;
    expectedImpact: string;
  }>;
  pricingAndOffer: string[];
  messaging: string[];
  automationOpportunities: string[];
  roadmap30: string[];
  roadmap60: string[];
  roadmap90: string[];
  limitations: string;
};

export async function generateAudit(input: AuditInput): Promise<AuditReport> {
  const client = new OpenAI({ apiKey: requiredEnv("OPENAI_API_KEY") });

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior conversion strategist. Produce a specific, evidence-based website revenue audit.
Never invent analytics, revenue, conversion rates, customer behavior, competitor facts, or technical measurements.
Use only the supplied website text and customer statements. Clearly label uncertainty.
Return valid JSON matching this exact schema:
{
  "title": "string",
  "executiveSummary": "string",
  "findings": [{"priority":"Critical|High|Medium","title":"string","evidence":"string","recommendation":"string","expectedImpact":"string"}],
  "pricingAndOffer":["string"],
  "messaging":["string"],
  "automationOpportunities":["string"],
  "roadmap30":["string"],
  "roadmap60":["string"],
  "roadmap90":["string"],
  "limitations":"string"
}
Include 8-12 findings. Recommendations must be actionable and ethical. Do not promise financial results.`
      },
      {
        role: "user",
        content: JSON.stringify(input)
      }
    ]
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("AI returned no audit content.");

  const parsed = JSON.parse(raw) as AuditReport;
  if (!parsed.findings?.length || !parsed.executiveSummary) {
    throw new Error("AI audit failed structural validation.");
  }
  return parsed;
}
