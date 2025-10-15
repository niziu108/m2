"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const params = useSearchParams();

  return (
    <h1 className="font-[Bungee] text-[#E9C87D] text-center text-[clamp(22px,5vw,48px)]">
      NIE ZNALEZIONO TEJ OFERTY
    </h1>
  );
}