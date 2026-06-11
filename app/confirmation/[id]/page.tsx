import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EVENTS } from "@/lib/data";
import ConfirmationClient from "./ConfirmationClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { id } = await params;

  const reg = await prisma.registration.findUnique({
    where: { trackingId: id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!reg) return notFound();

  const eventIds: string[] = JSON.parse(reg.selectedEvents);
  const chosenEvents = EVENTS.filter((e) => eventIds.includes(e.id));

  return (
    <ConfirmationClient
      trackingId={reg.trackingId}
      userName={reg.user.name || reg.user.email}
      userEmail={reg.user.email}
      chosenEvents={chosenEvents}
      createdAt={reg.createdAt.toISOString()}
    />
  );
}
