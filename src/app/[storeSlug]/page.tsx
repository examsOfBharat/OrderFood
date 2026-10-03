import { notFound } from "next/navigation";
import { getStoreBySlug, getPublicStoreMenu } from "../actions";
import { StoreMenuClient } from "./StoreMenuClient";
import { MapPin, Clock, Info, Star, ChevronRight, Percent } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const resolvedParams = await params;
  const store = await getStoreBySlug(resolvedParams.storeSlug);
  const session = await auth();
  
  if (!store) {
    notFound();
  }

  const { categories, items } = await getPublicStoreMenu(store._id);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-[13px] text-zinc-400 mb-6 font-medium">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-zinc-900 font-bold">{store.name}</span>
        </div>

        {/* Store Title */}
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{store.name}</h1>
          </div>
        </div>

        {/* Swiggy-style Store Details Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
          
          <div className="relative flex items-center gap-2 text-[15px] font-bold text-zinc-800 dark:text-zinc-200 mb-2">
            <div className="bg-green-700 text-white flex items-center justify-center rounded-full h-5 w-5">
              <Star className="h-3.5 w-3.5 fill-white" />
            </div>
            <span>4.4 (1K+ ratings)</span>
            <span className="text-zinc-300 mx-1">•</span>
            <span className="text-zinc-600">₹{store.deliverySettings?.minimumOrder || 150} for two</span>
          </div>

          <div className="relative text-[14px] text-orange-600 font-bold mb-4 underline decoration-orange-600/30 underline-offset-4 cursor-pointer">
            {store.description || "North Indian, Chinese, Sweets"}
          </div>

          {/* Timeline / Location Info */}
          <div className="relative flex flex-col gap-4 pl-2">
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
                <div className="h-6 w-0.5 bg-zinc-200 dark:bg-zinc-800 my-0.5"></div>
                <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                  Outlet <span className="text-zinc-500 font-medium">{store.address}</span>
                </div>
                <div className="flex gap-2 text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                  30-35 mins <span className="text-zinc-500 font-medium">Delivery to your location</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-zinc-600 dark:text-zinc-400">
              <div className={`h-2.5 w-2.5 rounded-full ${store.isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
              {store.isOpen ? "Accepting orders" : "Currently closed"}
            </div>
          </div>
        </div>

        {/* Offers Section Placeholder */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-[200px] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full"><Percent className="h-5 w-5 text-blue-600" /></div>
            <div>
              <div className="font-bold text-[14px]">50% OFF</div>
              <div className="text-zinc-500 text-[11px] font-bold uppercase">Upto ₹100</div>
            </div>
          </div>
          <div className="min-w-[200px] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full"><Percent className="h-5 w-5 text-orange-600" /></div>
            <div>
              <div className="font-bold text-[14px]">Flat ₹150 OFF</div>
              <div className="text-zinc-500 text-[11px] font-bold uppercase">On orders above ₹499</div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <StoreMenuClient 
            store={store} 
            categories={categories} 
            items={items} 
            userId={(session?.user as any)?.id || null} 
          />
        </div>
      </div>
    </div>
  );
}
