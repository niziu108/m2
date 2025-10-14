import { prisma } from '@/lib/prisma'
export async function GET() {
  const count = await prisma.listing.count()
  return new Response(JSON.stringify({ ok:true, count }), { headers:{ 'content-type':'application/json' }})
}
