import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "../../../lib/stripe";
import { getAppUrl, PRODUCT_NAME, PRICE_CENTS, CURRENCY } from "./settings";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  businessName: z.string().min(2).max(120),
  website: z.string().url().max(300),
  challenge: z.string().min(10).max(450),
  notes: z.string().max(450).optional().default(""),
  consent: z.literal("yes")
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const client = stripe();
    const APP_URL = getAppUrl();

    const session = await client.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: PRICE_CENTS,
            product_data: {
              name: PRODUCT_NAME,
              description: "Focused website conversion and growth audit delivered by email."
            }
          }
        }
      ],
      metadata: {
        name: data.name,
        email: data.email,
        businessName: data.businessName,
        website: data.website,
        challenge: data.challenge,
        notes: data.notes,
        consent: data.consent
      },
      payment_intent_data: {
        metadata: {
          product: "revenue_rescue_audit",
          customer_email: data.email,
          business_name: data.businessName
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown checkout error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
