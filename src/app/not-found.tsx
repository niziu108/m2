// app/not-found.tsx
import { Suspense } from "react";
import NotFoundClient from "@/components/NotFoundClient";

export const dynamic = "force-dynamic"; // nie próbuj prerenderować _not-found

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] grid place-items-center p-8">
      <Suspense fallback={<span>Ładowanie…</span>}>
        <NotFoundClient />
      </Suspense>
    </main>
  );
}