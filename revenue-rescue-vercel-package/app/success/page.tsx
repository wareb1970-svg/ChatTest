export default function SuccessPage() {
  return (
    <main className="center">
      <section className="panel narrow">
        <div className="eyebrow">Payment received</div>
        <h1>Your audit is being prepared.</h1>
        <p className="lead">
          Stripe will confirm the payment to our server. Once confirmed, the report will be generated
          and delivered to the email entered during checkout.
        </p>
        <a className="buttonLink" href="/">Return home</a>
      </section>
    </main>
  );
}
