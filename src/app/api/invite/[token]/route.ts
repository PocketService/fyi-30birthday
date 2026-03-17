import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
    include: {
      rsvps: { include: { activity: true } },
    },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  return NextResponse.json(guest);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  const body = await req.json();

  const updated = await prisma.guest.update({
    where: { token: params.token },
    data: {
      foodPreference: body.foodPreference,
      allergies: body.allergies || null,
      sleepover: body.sleepover,
      sleepoverFrom: body.sleepover && body.sleepoverFrom
        ? new Date(body.sleepoverFrom)
        : null,
      sleepoverTo: body.sleepover && body.sleepoverTo
        ? new Date(body.sleepoverTo)
        : null,
      plusOneCount: body.plusOneCount ?? 0,
      plusOneNames: body.plusOneNames ?? [],
      profileComplete: true,
    },
  });

  return NextResponse.json(updated);
}
