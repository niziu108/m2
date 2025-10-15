export default function GoogleStars({ rating }: { rating: number }) {
  const full = Math.floor(rating ?? 0);
  const half = rating - full >= 0.5;
  const total = 5;

  return (
    <div className="inline-flex items-center gap-1" aria-label={`Ocena ${rating} / 5`}>
      {Array.from({ length: total }).map((_, i) => {
        const state = i < full ? 'full' : i === full && half ? 'half' : 'empty';
        return (
          <span key={i} className="text-[#E9C87D] text-lg leading-none">
            {state === 'full' ? '★' : state === 'half' ? '☆' : '☆'}
          </span>
        );
      })}
      <span className="ml-1 text-sm opacity-80">{rating.toFixed(1)}</span>
    </div>
  );
}