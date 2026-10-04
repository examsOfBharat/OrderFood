"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder, verifyPayment } from "./actions";
import Script from "next/script";
import { MapPin, CreditCard, Banknote, ArrowLeft, Loader2, CheckCircle2, XCircle, QrCode } from "lucide-react";
import Link from "next/link";

export function CheckoutClient({ savedAddress, userId }: { savedAddress?: any, userId: string }) {
  const router = useRouter();
  const { items, clearCart, syncUser } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [orderState, setOrderState] = useState<"idle" | "placing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [address, setAddress] = useState({
    street: savedAddress?.street || "",
    city: savedAddress?.city || "",
    state: savedAddress?.state || "",
    zipCode: savedAddress?.zipCode || "",
  });

  useEffect(() => {
    setIsMounted(true);
    syncUser(userId);
    if (items.length === 0 && orderState === "idle") {
      router.push("/");
    }
  }, [items, router, userId, syncUser, orderState]);

  useEffect(() => {
    if (orderState === "success" && completedOrderId) {
      const timer = setTimeout(() => {
        router.push(`/orders/${completedOrderId}`);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [orderState, router, completedOrderId]);

  if (!isMounted || (items.length === 0 && orderState === "idle")) return null;

  const storeId = items[0]?.storeId; // Assuming all items are from same store
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = Math.round(subtotal * 0.05);
  // We'll hardcode delivery fee to 0 here for UI display, actual is calculated on server
  const total = subtotal + taxes;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderState("placing");

    try {
      // 1. Create order on server
      const orderRes = await createOrder({
        storeId,
        items: items.map(i => ({ _id: i._id, quantity: i.quantity })),
        address,
        paymentMethod
      });

      if (orderRes.method === "COD") {
        setCompletedOrderId(orderRes.orderId);
        setOrderState("success");
        clearCart();
        return;
      }

      // 2. Initialize Razorpay Checkout
      if (orderRes.method === "ONLINE") {
        const options = {
          key: orderRes.keyId, 
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "LocalBites",
          description: `Order from ${orderRes.storeName}`,
          order_id: orderRes.razorpayOrderId,
          handler: async function (response: any) {
            try {
              setOrderState("placing");
              // 3. Verify Payment
              await verifyPayment({
                orderId: orderRes.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              
              setCompletedOrderId(orderRes.orderId);
              setOrderState("success");
              clearCart();
            } catch (error: any) {
              setOrderState("error");
              setErrorMessage(`Verification Failed: ${error.message}`);
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#16a34a"
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI (PhonePe, GPay)",
                  instruments: [
                    { method: "upi" }
                  ],
                },
                other: {
                  name: "Other Payment Methods",
                  instruments: [
                    { method: "card" },
                    { method: "netbanking" },
                    { method: "wallet" }
                  ]
                }
              },
              sequence: ["block.upi", "block.other"],
              preferences: { show_default_blocks: false }
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          setOrderState("error");
          setErrorMessage(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
        
        // Return to idle so user can interact with the Razorpay modal overlay
        setOrderState("idle");
      }
    } catch (error: any) {
      setOrderState("error");
      setErrorMessage(error.message || "Failed to place order");
    }
  };



  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Left Col - Form */}
      <div className="flex-1 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to menu
          </Link>
          <h1 className="text-3xl font-black tracking-tight mb-2">Checkout</h1>
          <p className="text-zinc-500 font-medium">Complete your order details below.</p>
        </div>

        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
          {/* Address Section */}
          <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-xl font-bold">
              <MapPin className="h-5 w-5 text-primary" /> Delivery Address
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street" className="font-semibold text-zinc-700 dark:text-zinc-300">Street Address</Label>
                <Input id="street" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900" placeholder="123 Main St, Apartment 4B" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="font-semibold text-zinc-700 dark:text-zinc-300">City</Label>
                <Input id="city" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900" placeholder="Harnaut" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="font-semibold text-zinc-700 dark:text-zinc-300">State</Label>
                <Input id="state" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900" placeholder="Bihar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="font-semibold text-zinc-700 dark:text-zinc-300">Pincode</Label>
                <Input id="zip" required value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900" placeholder="803110" />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-xl font-bold">
              <CreditCard className="h-5 w-5 text-primary" /> Payment Method
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'ONLINE' ? 'border-green-500 bg-green-50 text-green-700' : 'border-zinc-200 hover:border-zinc-300'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                <QrCode className={`h-8 w-8 ${paymentMethod === 'ONLINE' ? 'text-green-600' : 'text-zinc-400'}`} />
                <div className="text-center">
                  <span className="font-bold block text-[15px]">Pay via UPI or Cards</span>
                  <span className="text-xs font-medium text-zinc-500 block mt-1">(GPay, PhonePe, Paytm, Visa)</span>
                </div>
              </label>
              
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-zinc-200 hover:border-zinc-300'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <Banknote className={`h-8 w-8 ${paymentMethod === 'COD' ? 'text-orange-600' : 'text-zinc-400'}`} />
                <div className="text-center">
                  <span className="font-bold block text-[15px]">Cash on Delivery</span>
                  <span className="text-xs font-medium text-zinc-500 block mt-1">(Pay cash to rider)</span>
                </div>
              </label>
            </div>
          </section>
        </form>
      </div>

      {/* Right Col - Order Summary */}
      <div className="w-full md:w-[380px] shrink-0">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm sticky top-24 overflow-hidden">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold">Order Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-[15px] font-medium">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">{item.quantity}x</span>
                    <span className="text-zinc-700 dark:text-zinc-300 line-clamp-1">{item.name}</span>
                  </div>
                  <span className="text-zinc-900 dark:text-white">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-[15px]">
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Taxes & Fees</span>
                <span>₹{taxes}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Delivery Partner Fee</span>
                <span className="text-green-600 font-semibold">Calculated at checkout</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between text-xl font-black mb-6">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
            
            <Button 
              type="submit" 
              form="checkout-form" 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25"
              disabled={orderState === "placing"}
            >
              {orderState === "placing" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : (paymentMethod === "ONLINE" ? `Pay ₹${total}` : `Place Order (COD)`)}
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Full Screen Modal Overlay */}
      {orderState !== "idle" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            
            {orderState === "placing" && (
              <>
                <div className="relative mb-8 mt-4">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="bg-primary text-white p-5 rounded-full relative z-10 shadow-xl shadow-primary/30">
                    <Loader2 className="h-10 w-10 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 text-zinc-900 dark:text-white">Placing Order</h3>
                <p className="text-zinc-500 font-medium mb-2">Confirming with the restaurant...</p>
              </>
            )}

            {orderState === "success" && (
              <>
                <div className="bg-green-500 text-white p-5 rounded-full mb-6 shadow-xl shadow-green-500/30 animate-in slide-in-from-bottom-5 duration-500">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black mb-3 text-green-600">Confirmed!</h3>
                <p className="text-zinc-500 font-medium mb-8">Your delicious food is being prepared. You will receive a notification shortly.</p>
                <Button className="w-full font-bold h-14 rounded-xl text-lg shadow-lg shadow-primary/20" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </>
            )}

            {orderState === "error" && (
              <>
                <div className="bg-red-500 text-white p-5 rounded-full mb-6 shadow-xl shadow-red-500/30 animate-in slide-in-from-bottom-5 duration-500">
                  <XCircle className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-red-600">Order Failed</h3>
                <p className="text-zinc-500 font-medium mb-8">{errorMessage}</p>
                <Button variant="outline" className="w-full font-bold h-14 rounded-xl text-lg" onClick={() => setOrderState("idle")}>
                  Try Again
                </Button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
