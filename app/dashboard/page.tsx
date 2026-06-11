import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Registration } from "@prisma/client";
import { EVENTS, CATEGORY_COLORS } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth");

  const registrations = await prisma.registration.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = registrations.map((r: Registration) => ({
    trackingId: r.trackingId,
    createdAt: r.createdAt.toISOString(),
    events: EVENTS.filter((e) => {
      const ids: string[] = JSON.parse(r.selectedEvents);
      return ids.includes(e.id);
    }),
  }));

  return (
    <DashboardClient
      user={{ name: user.name || null, email: user.email }}
      registrations={serialized}
    />
  );
}
