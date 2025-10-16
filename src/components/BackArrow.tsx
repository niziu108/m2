'use client';

import { useRouter } from 'next/navigation';

export default function BackArrow() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Wróć"
      className="
        fixed top-3 left-3 z-50
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
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}