'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { navState } from '@/components/NavProgress';

function cameFromThisSite() {
  if (navState.internal) return true;
  if (window.history.length <= 1) return false;
  try {
    return new URL(document.referrer).origin === location.origin;
  } catch {
    return false;
  }
}

/* Zwykły link do listy, a „wstecz” tylko dla kogoś, kto przyszedł z naszej strony:
   po wejściu z Google albo Facebooka router.back() wyrzucał człowieka z powrotem do wyników. */
export default function BackArrow({
  label = 'Wróć',
  fallbackHref = '/',
}: {
  label?: string;
  fallbackHref?: string;
}) {
  const router = useRouter();
  const [showGuard, setShowGuard] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || !cameFromThisSite()) return;
    e.preventDefault();
    setShowGuard(true);
    setTimeout(() => router.back(), 10);
  };

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

      <Link
        href={fallbackHref}
        prefetch={false}
        onClick={handleClick}
        aria-label={label}
        className="
          fixed top-4 sm:top-6 left-3 z-[10000]
          inline-flex items-center gap-1.5
          rounded-full px-3 py-1.5
          border border-[#E9C87D]
          bg-[var(--background)]/85 backdrop-blur-[2px]
          !text-[var(--gold-ink)]
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
      </Link>
    </>
  );
}
