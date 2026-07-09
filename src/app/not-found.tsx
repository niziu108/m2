import { Suspense } from "react";
import NotFoundClient from "@/components/NotFoundClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)] grid place-items-center p-8">
      <Suspense fallback={<span>Ładowanie…</span>}>
        <NotFoundClient />
      </Suspense>
    </main>
  );
}
