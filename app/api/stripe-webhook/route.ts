import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { requiredEnv } from "../../../lib/config";
import { fetchWebsiteText } from "../../../lib/scrape";
import { generateAudit } from "../../../lib/audit";
import { buildPdf } from "../../../lib/pdf";
import { sendAuditEmail } from "../../../lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return new NextResponse("Missing Stripe signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      body,
      signature,
      requiredEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook";
    return new NextResponse(message, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: "not_paid" });
  }

  const metadata = session.metadata || {};
  const required = ["name", "email", "businessName", "website", "challenge"];
  for (const key of required) {
    if (!metadata[key]) {
      console.error("Missing metadata", { eventId: event.id, key });
      return new NextResponse(`Missing order metadata: ${key}`, { status: 500 });
    }
  }

  try {
    const websiteText = await fetchWebsiteText(metadata.website);
    const report = await generateAudit({
      name: metadata.name,
      email: metadata.email,
      businessName: metadata.businessName,
      website: metadata.website,
      challenge: metadata.challenge,
      notes: metadata.notes || "",
      websiteText
    });
    const pdf = await buildPdf(report, metadata.businessName, metadata.website);
    await sendAuditEmail(metadata.email, metadata.businessName, pdf);

    console.log("AUDIT_DELIVERED", {
      stripeEventId: event.id,
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent,
      customerEmail: metadata.email
    });

    return NextResponse.json({ received: true, delivered: true });
  } catch (error) {
    console.error("FULFILLMENT_FAILED", {
      stripeEventId: event.id,
      checkoutSessionId: session.id,
      error: error instanceof Error ? error.message : String(error)
    });
    return new NextResponse("Fulfillment failed; Stripe will retry webhook.", { status: 500 });
  }
}
