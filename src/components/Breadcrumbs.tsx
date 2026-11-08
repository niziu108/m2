import Link from 'next/link';

export type Crumb = { name: string; href?: string };

/* Widoczna ścieżka: ludzie wiedzą, gdzie są, a Google dostaje linki do kategorii i miejscowości. */
export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Ścieżka do tej strony" className={`text-[12px] sm:text-[13px] ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[var(--foreground-soft)]">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            {it.href ? (
              <Link
                href={it.href}
                prefetch={false}
                className="!text-[var(--foreground-soft)] underline-offset-2 hover:underline"
              >
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--foreground)]">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
