import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function getClientIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function toSource({ referer, host }: { referer: string | null; host: string | null }) {
  if (!referer) return "UNKNOWN";
  try {
    const refUrl = new URL(referer);
    if (refUrl.hostname === (host || "")) return "INTERNAL";
    return "EXTERNAL";
  } catch {
    return "UNKNOWN";
  }
}

export async function POST(req: NextRequest) {
  let payload: any = {};
  try {
    payload = await req.json();
  } catch {}

  const listingId = payload?.listingId?.toString?.() || "";
  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  const source = toSource({ referer, host }) as "INTERNAL" | "EXTERNAL" | "UNKNOWN";

  // Deduplikacja: nie licz tego samego IP+UA dla tej oferty przez 6 godzin
  const ipHash = crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex");
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const exists = await prisma.listingView.findFirst({
    where: { listingId, ipHash, createdAt: { gte: since } },
    select: { id: true },
  });

  if (!exists) {
    await prisma.listingView.create({
      data: { listingId, source, referrer: referer || null, ua, ipHash },
    });
  }

  return NextResponse.json({ ok: true });
}
