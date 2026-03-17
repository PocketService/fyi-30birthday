import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string; activityId: string } }
) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  const activity = await prisma.activity.findUnique({
    where: { id: params.activityId },
    include: {
      rsvps: {
        include: {
          guest: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  const myRsvp = activity.rsvps.find((r) => r.guestId === guest.id);
  const attendees = activity.rsvps
    .filter((r) => r.status === "ATTENDING")
    .map((r) => r.guest.name);

  return NextResponse.json({
    ...activity,
    myStatus: myRsvp?.status || null,
    attendees,
    attendeeCount: attendees.length,
  });
}
