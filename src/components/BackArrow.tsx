'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BackArrow() {
  const router = useRouter();
  const [showGuard, setShowGuard] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromSameOrigin =
      document.referrer && new URL(document.referrer).origin === window.location.origin;
    setCanGoBack(fromSameOrigin && window.history.length > 1);
  }, []);

  const handleClick = () => {
    setShowGuard(true);
    setTimeout(() => router.back(), 10);
  };

  if (!canGoBack) return null; // 🔹 ukryj strzałkę jeśli nie ma historii

  return (
    <>
      {showGuard && (
        <div
          className="
            fixed inset-0 z-[9999]
            bg-[#131313]/95
            opacity-100
            transition-opacity duration-200
          "
          aria-hidden="true"
        />
      )}

      <button
        onClick={handleClick}
        aria-label="Wróć"
        className="
          fixed top-5 sm:top-7 left-3 z-[10000]
          flex items-center justify-center
          w-6 h-6 sm:w-7 sm:h-7 rounded-full
          border border-[#E9C87D]
          text-[#E9C87D]
          hover:bg-[#E9C87D]/10
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
          className='w-3.5 h-3.5 sm:w-4 sm:h-4'
        >
          <path d='M15 18l-6-6 6-6' />
        </svg>
      </button>
    </>
  );
}