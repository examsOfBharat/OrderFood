// @ts-nocheck
"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal, storeId } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!isMounted) {
    return (
      <button className="relative flex items-center text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
        <ShoppingBag className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger className="relative flex items-center text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer">
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-6 bg-background shadow-2xl border-l">
        <SheetHeader className="px-0 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold tracking-tight">Your Order</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-1 py-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-4 border-b last:border-0 group">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-base">{item.name}</span>
                      <span className="text-muted-foreground text-sm font-medium">₹{item.price} each</span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
                      <div className="flex items-center bg-muted/50 border rounded-full p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-background shadow-sm transition-all"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-sm font-bold w-8 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-background shadow-sm transition-all"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-auto pt-6 pb-2 space-y-6 bg-background">
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{getTotal()}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl">
                  <span>Total</span>
                  <span>₹{getTotal()}</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3">
                <Button variant="outline" size="lg" className="col-span-4 rounded-xl font-semibold" onClick={clearCart}>
                  Clear
                </Button>
                <Button size="lg" className="col-span-8 rounded-xl font-bold text-md shadow-lg hover:shadow-xl transition-all" onClick={() => router.push('/checkout')}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
