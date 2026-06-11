import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { eventIds } = await req.json();
    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json({ error: "Please select at least one event." }, { status: 400 });
    }

    const reg = await prisma.registration.create({
      data: {
        userId: user.id,
        selectedEvents: JSON.stringify(eventIds),
      },
    });

    return NextResponse.json({ success: true, trackingId: reg.trackingId });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
