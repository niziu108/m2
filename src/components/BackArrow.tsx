'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BackArrow({ label = 'Wróć' }: { label?: string }) {
  const router = useRouter();
  const [showGuard, setShowGuard] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 🔹 Wystarczy sprawdzić długość historii
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  const handleClick = () => {
    setShowGuard(true);
    setTimeout(() => router.back(), 10);
  };

  if (!canGoBack) return null; // ukryj, jeśli nie ma historii

  return (
    <>
      {showGuard && (
        <div
          className="
            fixed inset-0 z-[9999]
            bg-[var(--background)]/95
            opacity-100
            transition-opacity duration-200
          "
          aria-hidden="true"
        />
      )}

      <button
        onClick={handleClick}
        aria-label={label}
        className="
          fixed top-4 sm:top-6 left-3 z-[10000]
          inline-flex items-center gap-1.5
          rounded-full px-3 py-1.5
          border border-[#E9C87D]
          bg-[var(--background)]/85 backdrop-blur-[2px]
          text-[var(--gold-ink)]
          text-[12px] sm:text-[13px] font-semibold
          hover:bg-[#E9C87D]/20
          active:scale-[0.96]
          transition-all duration-200
        "
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.4'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0'
        >
          <path d='M15 18l-6-6 6-6' />
        </svg>
        {label}
      </button>
    </>
  );
}