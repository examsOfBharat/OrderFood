import { getUserOrders } from "./actions";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await getUserOrders();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">


      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">Past Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">No orders yet!</h2>
            <p className="text-zinc-500 mb-6">Looks like you haven't placed any orders.</p>
            <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors">
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {orders.map((order: any, idx: number) => (
              <div key={order._id} className={`p-4 sm:p-5 ${idx !== orders.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/50' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors`}>
                <Link href={`/orders/${order._id}`} className="flex justify-between items-start gap-4">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[15px] sm:text-base text-zinc-900 dark:text-white truncate">
                        {order.store?.name || "Store"}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    
                    <p className="text-zinc-500 text-xs sm:text-[13px] mb-2 leading-relaxed truncate">
                      {order.items.map((i: any) => `${i.quantity} x ${i.name}`).join(", ")}
                    </p>
                    
                    <p className="text-zinc-400 text-[11px] sm:text-xs">
                      {new Date(order.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end shrink-0">
                    <p className="font-bold text-sm sm:text-[15px] text-zinc-900 dark:text-white">₹{order.pricing.total}</p>
                    <div className="mt-3 flex items-center text-orange-600 dark:text-orange-500 text-xs font-bold hover:text-orange-700 transition-colors">
                      Details <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>

                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
