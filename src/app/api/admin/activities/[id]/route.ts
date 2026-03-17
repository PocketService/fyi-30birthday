import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const activity = await prisma.activity.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description || null,
      date: new Date(body.date),
      time: body.time,
      location: body.location,
    },
  });

  return NextResponse.json(activity);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.activity.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
