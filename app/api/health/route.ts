import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    // Check the actual schema used by the home page, not only database connectivity.
    await prisma.project.count();
    return Response.json({ status: "ok", service: "portfolio" }, { headers });
  } catch {
    return Response.json({ status: "unavailable", service: "portfolio" }, { status: 503, headers });
  }
}
