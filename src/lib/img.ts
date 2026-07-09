// src/lib/img.ts
// Odchudza zdjęcia z Cloudinary bez ruszania danych w bazie:
// wstrzykuje f_auto (webp/avif) + q_auto (auto jakość) + opcjonalny limit szerokości.
// Dla URLi spoza Cloudinary zwraca wejście bez zmian.

const MARKER = '/image/upload/';

export function cldOptimize(url?: string | null, width?: number): string {
  if (!url) return '';
  const i = url.indexOf(MARKER);
  if (i === -1) return url; // nie Cloudinary -> bez zmian

  const before = url.slice(0, i + MARKER.length);
  const after = url.slice(i + MARKER.length);

  // już zoptymalizowane -> nie dubluj
  if (/^(f_auto|q_auto)/.test(after)) return url;

  const t = ['f_auto', 'q_auto'];
  if (width && width > 0) t.push(`w_${width}`, 'c_limit');

  return `${before}${t.join(',')}/${after}`;
}
