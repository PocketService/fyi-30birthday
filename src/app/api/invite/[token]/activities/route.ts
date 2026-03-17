import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  const activities = await prisma.activity.findMany({
    orderBy: { date: "asc" },
    include: {
      rsvps: {
        where: { guestId: guest.id },
      },
    },
  });

  return NextResponse.json(activities);
}
