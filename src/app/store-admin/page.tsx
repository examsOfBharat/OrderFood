import { getStoreProfile } from "./actions";
import Link from "next/link";
import { Package, UtensilsCrossed, Settings, ChevronRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const QUOTES = [
  { text: "People who love to eat are always the best people.", author: "Julia Child" },
  { text: "Food is symbolic of love when words are inadequate.", author: "Alan D. Wolfelt" },
  { text: "A recipe has no soul. You, as the cook, must bring soul to the recipe.", author: "Thomas Keller" },
  { text: "To eat is a necessity, but to eat intelligently is an art.", author: "François de La Rochefoucauld" },
  { text: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf" }
];

export default async function DashboardHome() {
  const store = await getStoreProfile();
  
  // Pick a pseudo-random quote based on the current day
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Welcome back, {store.name}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Here's what's happening at your restaurant today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
          Store is {store.isOpen ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Quote of the Day Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-48 h-48 -mr-12 -mt-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="text-orange-200 font-bold tracking-widest uppercase text-xs mb-4 block">Quote of the Day</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
            "{quote.text}"
          </h2>
          <p className="text-orange-200 font-medium">— {quote.author}</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h3 className="text-xl font-bold mt-10 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Manage Orders */}
        <Link href="/store-admin/orders" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Live Orders</h3>
            <p className="text-zinc-500 text-sm">Accept, dispatch, or manage incoming customer orders.</p>
          </div>
          <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
            View Orders <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Manage Menu */}
        <Link href="/store-admin/menu" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Menu Management</h3>
            <p className="text-zinc-500 text-sm">Add new dishes, update prices, or mark items out of stock.</p>
          </div>
          <div className="mt-6 flex items-center text-green-600 font-bold text-sm">
            Edit Menu <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Store Settings */}
        <Link href="/store-admin/settings" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Store Profile</h3>
            <p className="text-zinc-500 text-sm">Update your store hours, delivery radius, and basic information.</p>
          </div>
          <div className="mt-6 flex items-center text-purple-600 font-bold text-sm">
            Settings <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>
    </div>
  );
}
