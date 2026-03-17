import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activities = await prisma.activity.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { rsvps: true } } },
  });

  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const activity = await prisma.activity.create({
    data: {
      title: body.title,
      description: body.description || null,
      date: new Date(body.date),
      time: body.time,
      location: body.location,
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
