// Marker attribute the deploy workflow's post-deploy check greps for
// (.github/workflows/deploy.yml) — keep it in sync if this changes.
export default function Home() {
  return (
    <main data-health-check="ok">
      <h1>ACM Hotels</h1>
      <p>Сайт в разработке.</p>
    </main>
  );
}
