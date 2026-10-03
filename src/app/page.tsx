import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { getActiveStores } from "./actions";
import { ChefHat, Search, Star, Clock, MapPin, ChevronRight, Percent } from "lucide-react";
import { auth, signOut } from "@/auth";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  const stores = await getActiveStores();
  const session = await auth();

  const inspirationCategories = [
    { name: "Biryani", emoji: "🥘", color: "bg-orange-100" },
    { name: "Pizza", emoji: "🍕", color: "bg-red-100" },
    { name: "Burger", emoji: "🍔", color: "bg-yellow-100" },
    { name: "Sweets", emoji: "🍩", color: "bg-pink-100" },
    { name: "Rolls", emoji: "🌯", color: "bg-amber-100" },
    { name: "Healthy", emoji: "🥗", color: "bg-green-100" },
    { name: "Coffee", emoji: "☕", color: "bg-amber-900/10" },
    { name: "Ice Cream", emoji: "🍦", color: "bg-blue-100" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans selection:bg-orange-500/30">
      {/* Sleek Header */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 shadow-sm">
        <div className="container mx-auto flex h-[72px] items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl md:text-3xl tracking-tighter text-zinc-900 dark:text-white">
              LocalBites
            </Link>
            
            <div className="hidden md:flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-orange-500 transition-colors cursor-pointer group">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="border-b-2 border-zinc-800 dark:border-white group-hover:border-orange-500 transition-colors">Your Location</span>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-orange-500" />
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {session?.user ? (
              <>
                <span className="text-[15px] font-bold hidden md:inline-block text-zinc-800 dark:text-zinc-200">
                  {session.user.name}
                </span>
                {(session.user as any).role === "store_owner" && (
                  <Link href="/store-admin" className="text-[15px] font-bold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Dashboard
                  </Link>
                )}
                <form action={async () => { "use server"; await signOut(); }}>
                  <Button type="submit" variant="ghost" className="font-bold text-[15px] text-zinc-600 hover:text-black dark:hover:text-white">Logout</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-bold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/register" className="text-[15px] font-bold text-white bg-black dark:bg-white dark:text-black px-5 py-2.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

        <HomeClient stores={stores} />
      
      {/* Footer */}
      <footer className="bg-zinc-100 dark:bg-zinc-950 py-16 border-t border-zinc-200 dark:border-zinc-900 mt-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 font-black text-2xl text-zinc-900 dark:text-white mb-4">
                LocalBites
              </div>
              <p className="text-zinc-500 font-medium text-[15px] max-w-xs">
                The fastest way to get your favorite local food and groceries delivered to your door.
              </p>
            </div>
            
            <div className="flex gap-16">
              <div className="space-y-4">
                <h4 className="font-black text-zinc-900 dark:text-white text-lg">Company</h4>
                <ul className="space-y-3 font-medium text-[15px] text-zinc-500">
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">About</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Team</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-zinc-900 dark:text-white text-lg">Contact</h4>
                <ul className="space-y-3 font-medium text-[15px] text-zinc-500">
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Help & Support</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Partner with us</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Ride with us</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-16 pt-8 text-center text-zinc-400 font-medium text-[14px]">
            &copy; {new Date().getFullYear()} LocalBites Technologies Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
