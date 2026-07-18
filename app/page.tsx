"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to start checkout.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Revenue Rescue</div>
        <h1>Find the revenue your website is leaving behind.</h1>
        <p className="lead">
          Receive a focused conversion and growth audit with prioritized recommendations,
          pricing observations, messaging fixes, and a 90-day action plan.
        </p>
        <div className="price">$149 <span>one time</span></div>
        <div className="promise">Delivered by email within 30 minutes of confirmed payment.</div>
      </section>

      <section className="panel">
        <h2>Order your audit</h2>
        <form action={submit}>
          <label>
            Your name
            <input name="name" required maxLength={80} />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={160} />
          </label>
          <label>
            Business name
            <input name="businessName" required maxLength={120} />
          </label>
          <label>
            Website
            <input name="website" type="url" required placeholder="https://..." maxLength={300} />
          </label>
          <label>
            Biggest revenue challenge
            <textarea name="challenge" required maxLength={450} rows={4} />
          </label>
          <label>
            Optional context
            <textarea name="notes" maxLength={450} rows={4} />
          </label>
          <label className="consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>I confirm I am authorized to submit this website for analysis.</span>
          </label>
          <button disabled={loading}>
            {loading ? "Opening secure checkout…" : "Purchase audit — $149"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      <section className="included">
        <h2>Included in every report</h2>
        <div className="grid">
          {[
            "Executive summary",
            "Revenue leak analysis",
            "Offer and pricing review",
            "Conversion improvements",
            "Messaging recommendations",
            "Customer journey review",
            "AI automation opportunities",
            "90-day action roadmap"
          ].map((item) => <div key={item}>{item}</div>)}
        </div>
      </section>

      <footer>
        <p>Delivery guarantee: if the completed audit is not delivered within 30 minutes of confirmed payment, contact support for a full refund.</p>
        <p>This service provides business analysis, not legal, accounting, or financial advice.</p>
      </footer>
    </main>
  );
}
