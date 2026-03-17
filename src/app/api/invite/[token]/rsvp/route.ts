import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  if (!guest.profileComplete) {
    return NextResponse.json(
      { error: "Please complete your profile first" },
      { status: 400 }
    );
  }

  const { activityId, status } = await req.json();

  const rsvp = await prisma.rSVP.upsert({
    where: {
      guestId_activityId: {
        guestId: guest.id,
        activityId,
      },
    },
    update: { status },
    create: {
      guestId: guest.id,
      activityId,
      status,
    },
  });

  return NextResponse.json(rsvp);
}
