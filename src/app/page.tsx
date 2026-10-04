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
