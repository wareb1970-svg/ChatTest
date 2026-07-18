export default function CancelPage() {
  return (
    <main className="center">
      <section className="panel narrow">
        <div className="eyebrow">Checkout canceled</div>
        <h1>No payment was completed.</h1>
        <p className="lead">You can return to the order page and try again.</p>
        <a className="buttonLink" href="/">Return to order page</a>
      </section>
    </main>
  );
}
