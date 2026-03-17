import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activities = await prisma.activity.findMany({
    orderBy: { date: "asc" },
    include: {
      rsvps: {
        include: {
          guest: {
            select: {
              id: true,
              name: true,
              foodPreference: true,
              allergies: true,
              sleepover: true,
              sleepoverFrom: true,
              sleepoverTo: true,
              plusOneCount: true,
              plusOneNames: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(activities);
}
