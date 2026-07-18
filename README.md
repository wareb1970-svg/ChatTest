# Revenue Rescue

A Vercel-ready Next.js application that sells and automatically fulfills a $149 website revenue audit.

## Workflow

1. Customer submits the order form.
2. Server creates a Stripe Checkout Session.
3. Customer voluntarily completes payment on Stripe.
4. Stripe sends a signed `checkout.session.completed` webhook.
5. The server confirms `payment_status === "paid"`.
6. The website is retrieved and converted to plain text.
7. OpenAI creates a structured audit without fabricating metrics.
8. PDFKit produces a PDF report.
9. Resend emails the PDF to the customer.
10. Vercel logs the Stripe event, PaymentIntent ID, and delivery outcome.

## Required environment variables

Copy `.env.example` to `.env.local` for local testing, or add the same variables in Vercel:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `APP_URL`

Never commit real keys.

## GitHub upload

Upload every file and folder in this package to the root of:

`wareb1970-svg/ChatTest`

Do not upload the outer `revenue-rescue` folder as a nested directory.

## Vercel deployment

1. In Vercel, choose **Add New → Project**.
2. Import `wareb1970-svg/ChatTest`.
3. Keep the detected framework as Next.js.
4. Add the environment variables.
5. Deploy.
6. Copy the final production URL.
7. Set `APP_URL` to that exact URL.
8. Redeploy after changing the environment variable.

## Stripe sandbox setup

1. Enter a Stripe sandbox.
2. Use the sandbox secret and publishable keys.
3. Add a webhook endpoint:
   `https://YOUR-VERCEL-DOMAIN/api/stripe-webhook`
4. Subscribe to:
   `checkout.session.completed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.
6. Redeploy.

Test card:

- Card: `4242 4242 4242 4242`
- Any future expiration date
- Any three-digit CVC
- Any postal code

## Resend setup

1. Verify a sending domain.
2. Create a sending-only API key.
3. Set `FROM_EMAIL` to a verified sender, for example:
   `Revenue Rescue <reports@example.com>`

For initial Resend testing, delivery may be restricted to the account owner until a domain is verified.

## OpenAI

Add an API key with available credit to `OPENAI_API_KEY`.

The audit prompt prohibits fabricated analytics, revenue figures, conversion rates, competitor facts, and technical measurements.

## Verification evidence

A successful test should produce all four:

1. Stripe sandbox PaymentIntent or Checkout Session marked paid.
2. Stripe webhook delivery marked successful.
3. Vercel log entry beginning `AUDIT_DELIVERED`.
4. Resend email log showing the PDF attachment was delivered.

Until all four exist, the workflow is not considered verified.

## Important operational boundary

The application accepts customer-initiated payments only. It does not create unauthorized charges, enter card information for customers, scrape private data, or send unsolicited marketing messages.
