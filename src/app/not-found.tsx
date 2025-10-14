// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404 – Nie znaleziono</h1>
        <p>Strona, której szukasz, nie istnieje.</p>
        <a href="/" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'underline' }}>
          Wróć na stronę główną
        </a>
      </div>
    </main>
  );
}
