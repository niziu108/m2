"use client";

export type Review = {
  authorName: string;
  authorPhoto?: string | null;
  rating: number;
  text: string;
  time?: string;
  url?: string;
};

export default function GoogleReviewCard({ r }: { r: Review }) {
  return (
    <article className="h-full rounded-2xl border border-white/10 bg-[#0f0f0f] p-4 flex flex-col">
      <header className="flex items-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={r.authorPhoto || "/avatar-fallback.svg"}
          alt=""
          className="size-10 rounded-full object-cover"
        />
        <div className="leading-tight">
          <div className="font-medium">{r.authorName}</div>
          <div className="text-xs text-white/60">{r.time || ""}</div>
        </div>
      </header>

      <div className="mb-3">
        {"★★★★★☆☆☆☆☆".slice(0, Math.max(0, Math.min(5, r.rating || 0)))}
      </div>

      <p className="text-sm text-white/80 line-clamp-[10] whitespace-pre-line">
        {r.text}
      </p>

      {r.url && (
        <a
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-xs text-[#E9C87D] hover:underline"
        >
          Zobacz w Google
        </a>
      )}
    </article>
  );
}
