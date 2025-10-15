// app/not-found.tsx
import { Suspense } from "react";
import NotFoundClient from "@/components/NotFoundClient";

// wyłącz SSG na 404, żeby Next nie próbował jej pre-renderować
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] grid place-items-center p-8">
      <Suspense fallback={<span>Ładowanie…</span>}>
        <NotFoundClient />
      </Suspense>
    </main>
  );
}