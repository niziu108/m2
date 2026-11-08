import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// To jedyny zapis do bazy bez logowania, więc wpuszczamy tylko istniejącą ofertę i przycięte nagłówki
const LISTING_ID = /^[A-Za-z0-9_-]{1,64}$/; // id to cuid (25 znaków), reszta to zapas
const MAX_HEADER_CHARS = 512;
const MAX_REFERRER_CHARS = 4096; // nazwa hosta jest na początku adresu, więc przycięcie jej nie rusza
const HOSTNAME = /^[a-z0-9._-]{1,253}$/;

function getClientIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

const withoutWww = (hostname: string) => hostname.replace(/^www\./, "");

// Adres przysyła przeglądarka, więc może tu być cokolwiek. Zapisujemy samą nazwę cudzej strony (np. www.facebook.com),
// bez ścieżki i parametrów, w których mogłyby być czyjeś dane.
function classifyReferrer(referrer: unknown, host: string | null) {
  const unknown = { source: "UNKNOWN", referrer: null } as const;
  if (typeof referrer !== "string") return unknown;

  let hostname: string;
  try {
    hostname = new URL(referrer.slice(0, MAX_REFERRER_CHARS)).hostname.toLowerCase();
  } catch {
    return unknown;
  }
  if (!HOSTNAME.test(hostname)) return unknown;

  const ownHostname = (host || "").split(":")[0].toLowerCase();
  if (withoutWww(hostname) === withoutWww(ownHostname)) return { source: "INTERNAL", referrer: null } as const;
  return { source: "EXTERNAL", referrer: hostname } as const;
}

export async function POST(req: NextRequest) {
  let payload: any = {};
  try {
    payload = await req.json();
  } catch {}

  const listingId = payload?.listingId;
  if (typeof listingId !== "string" || !LISTING_ID.test(listingId)) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });
  if (!listing) {
    return NextResponse.json({ error: "listing not found" }, { status: 404 });
  }

  const host = req.headers.get("host");
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  // Nie z nagłówka referer: to zapytanie wysyła sama oferta, więc nagłówek zawsze wskazuje jej adres
  const { source, referrer } = classifyReferrer(payload?.referrer, host);

  // Deduplikacja: nie licz tego samego IP+UA dla tej oferty przez 6 godzin
  const ipHash = crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex");
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const exists = await prisma.listingView.findFirst({
    where: { listingId, ipHash, createdAt: { gte: since } },
    select: { id: true },
  });

  if (!exists) {
    await prisma.listingView.create({
      data: {
        listingId,
        source,
        referrer,
        ua: ua.slice(0, MAX_HEADER_CHARS),
        ipHash,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
