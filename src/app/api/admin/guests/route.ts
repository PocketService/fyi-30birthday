import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
    include: { rsvps: { include: { activity: true } } },
  });

  return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const guest = await prisma.guest.create({
    data: {
      name: body.name,
      email: body.email || null,
    },
  });

  return NextResponse.json(guest, { status: 201 });
}
