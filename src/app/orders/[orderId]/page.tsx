import { getOrderById } from "../actions";
import { notFound, redirect } from "next/navigation";
import { OrderTrackerClient } from "./OrderTrackerClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen py-10">
      <OrderTrackerClient initialOrder={order} />
    </div>
  );
}
