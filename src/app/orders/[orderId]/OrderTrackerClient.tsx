"use client";

import { useState, useEffect } from "react";
import { getOrderById } from "../actions";
import { CheckCircle2, Clock, Bike, Package, XCircle, ArrowLeft, Loader2, MapPin } from "lucide-react";
import Link from "next/link";

export function OrderTrackerClient({ initialOrder }: { initialOrder: any }) {
  const [order, setOrder] = useState(initialOrder);

  // Poll for live updates every 5 seconds
  useEffect(() => {
    if (['delivered', 'cancelled'].includes(order.orderStatus)) return;

    const interval = setInterval(async () => {
      try {
        const updated = await getOrderById(order._id);
        if (updated) setOrder(updated);
      } catch (err) {
        console.error("Failed to poll order status");
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [order._id, order.orderStatus]);

  const statuses = [
    { id: 'placed', label: 'Order Placed', desc: 'We have received your order', icon: Clock },
    { id: 'accepted', label: 'Preparing', desc: 'The kitchen is preparing your food', icon: Package },
    { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Your food is on the way', icon: Bike },
    { id: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 },
  ];

  // Helper to map DB statuses to timeline steps
  const mapStatusToTimeline = (dbStatus: string) => {
    if (dbStatus === 'pending_payment') return 'placed';
    if (dbStatus === 'preparing' || dbStatus === 'accepted') return 'accepted';
    return dbStatus; 
  };

  const currentTimelineId = mapStatusToTimeline(order.orderStatus);

  return (
    <div className="max-w-md mx-auto px-4">
      <Link href="/orders" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors mt-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Link>

      {/* Main Container */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Minimal Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
          <div>
            <h1 className="text-lg font-black text-zinc-900 dark:text-white">
              {order.orderStatus === 'cancelled' ? 'Order Cancelled' : 
               order.orderStatus === 'delivered' ? 'Delivered' : 'Arriving Soon'}
            </h1>
            <p className="font-bold text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">Order #{order._id.slice(-6)}</p>
          </div>
          {order.orderStatus === 'delivered' && <CheckCircle2 className="w-8 h-8 text-green-600" />}
          {order.orderStatus === 'cancelled' && <XCircle className="w-8 h-8 text-red-600" />}
        </div>

        <div className="p-6">
          {/* Timeline UI */}
          {order.orderStatus === 'cancelled' ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-zinc-500 text-sm font-medium">Unfortunately, the store has cancelled your order. Any paid amount will be refunded automatically.</p>
            </div>
          ) : (
            <div className="space-y-6 py-2 relative ml-2">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-zinc-100 dark:bg-zinc-800 -z-10"></div>
              
              {statuses.map((step, index) => {
                const currentIndex = statuses.findIndex(s => s.id === currentTimelineId);
                const stepIndex = index;
                
                let state = "pending"; // pending, current, completed
                if (stepIndex < currentIndex) state = "completed";
                if (stepIndex === currentIndex) state = "current";

                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex gap-4 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 mt-0.5 ${
                      state === 'completed' ? 'bg-green-500 text-white' : 
                      state === 'current' ? 'bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]' : 
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${state === 'current' ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    <div>
                      <h4 className={`text-[15px] font-bold ${state === 'pending' ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 ${state === 'pending' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Summary (Compact Bill) */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">{order.store?.name}</h3>
            <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">{order.address?.street}, {order.address?.city}</p>
          </div>
            
          <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-3">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Bill Details</h4>
            <ul className="space-y-2.5 mb-4">
              {order.items.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span>{item.quantity} x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-between font-black text-sm pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
              <span>Total Paid</span>
              <span>₹{order.pricing.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
