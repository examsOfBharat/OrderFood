"use client";
import { useState, useEffect } from "react";
import { updateOrderStatus, getStoreOrders, type OrderStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellOff } from "lucide-react";

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Initialize audio object once
  const [audio] = useState(typeof window !== 'undefined' ? new Audio("https://actions.google.com/sounds/v1/alarms/positive_ding.ogg") : null);

  useEffect(() => {
    setIsMounted(true);

    const interval = setInterval(async () => {
      try {
        const freshOrders = await getStoreOrders();
        setOrders((prevOrders) => {
          // Play a "ding" sound if a brand new order arrives
          if (freshOrders.length > 0 && prevOrders.length > 0) {
            const newOrderArrived = freshOrders[0]._id !== prevOrders[0]._id && !prevOrders.find(o => o._id === freshOrders[0]._id);
            if (newOrderArrived && audioEnabled && audio) {
              audio.play().catch(e => console.log("Audio blocked"));
            }
          }
          return freshOrders;
        });
      } catch (err) {
        console.error("Failed to auto-refresh orders", err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async (orderId: string, status: OrderStatus) => {
    setLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.orderStatus));

  const renderOrderList = (list: any[]) => {
    if (list.length === 0) {
      return (
        <div className="p-12 mt-6 text-center text-muted-foreground bg-white dark:bg-zinc-900 rounded-2xl border border-dashed">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No orders found</h3>
          <p>Orders will appear here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 mt-6">
        {list.map(order => (
          <div key={order._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className="text-sm text-zinc-500 font-medium mt-1" suppressHydrationWarning>
                  {isMounted ? new Date(order.createdAt).toLocaleString() : new Date(order.createdAt).toISOString().split('T')[0]}
                </p>
                <div className="mt-3">
                  <Badge variant={['cancelled', 'delivered'].includes(order.orderStatus) ? "secondary" : "default"} className="px-3 py-1 text-xs">
                    {order.orderStatus.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-zinc-900 dark:text-white">₹{order.pricing.total}</p>
                <p className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 mt-2 uppercase tracking-wide">
                  {order.paymentStatus === "paid" ? "Paid Online" : "Cash on Delivery"}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-100 dark:border-zinc-900">
              <div>
                <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">Customer Details</h4>
                <p className="font-bold text-zinc-900 dark:text-white text-[15px]">{order.customer?.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{order.customer?.email}</p>
                <div className="mt-4">
                  <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-2">Delivery Address</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                    {order.address?.street}<br/>
                    {order.address?.city}, {order.address?.state} {order.address?.zipCode}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">Order Items</h4>
                <ul className="space-y-3">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx} className="text-[15px] flex justify-between items-start">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        <span className="text-orange-600 font-bold mr-2">{item.quantity}x</span> 
                        {item.name}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm">
                  <span className="text-zinc-500">Delivery Fee</span>
                  <span className="font-medium">₹{order.pricing.deliveryFee}</span>
                </div>
              </div>
            </div>

            {!['delivered', 'cancelled'].includes(order.orderStatus) && (
              <div className="flex gap-4 pt-2">
                <Button 
                  variant="outline" 
                  className={`flex-1 h-12 font-bold text-[15px] ${['placed', 'pending_payment'].includes(order.orderStatus) ? 'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200' : 'text-zinc-400 border-zinc-200 cursor-not-allowed'}`}
                  disabled={loadingId === order._id || !['placed', 'pending_payment'].includes(order.orderStatus)}
                  onClick={() => handleUpdate(order._id, 'cancelled')}
                >
                  {loadingId === order._id ? "Processing..." : "Cancel Order"}
                </Button>

                {['placed', 'pending_payment'].includes(order.orderStatus) && (
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 font-bold text-[15px] shadow-sm"
                    disabled={loadingId === order._id}
                    onClick={() => handleUpdate(order._id, 'accepted')}
                  >
                    {loadingId === order._id ? "Processing..." : "Accept Order"}
                  </Button>
                )}

                {['accepted', 'preparing'].includes(order.orderStatus) && (
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold text-[15px] shadow-sm"
                    disabled={loadingId === order._id}
                    onClick={() => handleUpdate(order._id, 'out_for_delivery')}
                  >
                    {loadingId === order._id ? "Processing..." : "Dispatch Order"}
                  </Button>
                )}

                {order.orderStatus === 'out_for_delivery' && (
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 font-bold text-[15px] shadow-sm"
                    disabled={loadingId === order._id}
                    onClick={() => handleUpdate(order._id, 'delivered')}
                  >
                    {loadingId === order._id ? "Processing..." : "Mark Delivered"}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h2 className="font-bold">Live Order Dashboard</h2>
          <p className="text-sm text-zinc-500">Auto-syncs every 30 seconds</p>
        </div>
        <Button 
          variant={audioEnabled ? "default" : "outline"} 
          className={audioEnabled ? "bg-green-600 hover:bg-green-700" : ""}
          onClick={() => {
            if (!audioEnabled && audio) {
              // Play silent/test sound to gain browser permission
              audio.volume = 0.5;
              audio.play().catch(e => {});
            }
            setAudioEnabled(!audioEnabled);
          }}
        >
          {audioEnabled ? <><Bell className="w-4 h-4 mr-2" /> Audio Alerts ON</> : <><BellOff className="w-4 h-4 mr-2 text-zinc-400" /> Audio Alerts OFF</>}
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-12">
          <TabsTrigger value="active" className="rounded-lg font-bold text-[15px]">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg font-bold text-[15px]">Cancelled / Past ({pastOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {renderOrderList(activeOrders)}
        </TabsContent>
        <TabsContent value="past">
          {renderOrderList(pastOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
