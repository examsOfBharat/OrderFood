import { getStoreOrders } from "./actions";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getStoreOrders();

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage incoming orders in real-time.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
