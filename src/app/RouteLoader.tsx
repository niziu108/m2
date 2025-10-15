'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  const search = useSearchParams();

  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (unmountTimer.current) clearTimeout(unmountTimer.current);

    setFadeOut(false);
    setShow(true);

    hideTimer.current = setTimeout(() => {
      setFadeOut(true);
      unmountTimer.current = setTimeout(() => setShow(false), 300);
    }, 2000);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (unmountTimer.current) clearTimeout(unmountTimer.current);
    };
  }, [pathname, search?.toString()]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] grid place-items-center pointer-events-auto
                  bg-[#131313] bg-opacity-95 transition-opacity duration-300
                  ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <div
        className="m2-breathe"
        style={{
          width: 160,
          height: 160,
          backgroundColor: '#E9C87D',
          WebkitMask: 'url("/logo.webp") center / contain no-repeat',
          mask: 'url("/logo.webp") center / contain no-repeat',
        }}
      />
      <style>{`
        @keyframes m2-breathe {
          0% { transform: scale(1); opacity: .96 }
          50% { transform: scale(1.08); opacity: 1 }
          100% { transform: scale(1); opacity: .96 }
        }
        .m2-breathe {
          animation: m2-breathe 1.2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}