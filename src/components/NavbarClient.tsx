"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Search, ChevronDown, User, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "./CartDrawer";

export function NavbarClient({ session }: { session: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide on auth, admin, and checkout pages to keep them distraction-free
  if (pathname?.startsWith('/store-admin') || pathname?.startsWith('/checkout') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-[72px] gap-6">
          
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-1 font-black text-3xl tracking-tighter text-zinc-900 dark:text-white">
            <span className="text-orange-500">Local</span>Bites
          </Link>

          {/* Search & Location Bar (Zomato Style) */}
          <div className="hidden md:flex flex-1 max-w-3xl items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm h-[52px] transition-shadow focus-within:shadow-md focus-within:border-zinc-300">
            <div className="flex items-center px-4 gap-2 bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-700 w-1/3 h-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
              <input type="text" placeholder="Harnaut, Bihar" className="bg-transparent border-none outline-none w-full text-[15px] text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-500 truncate cursor-pointer" readOnly />
              <ChevronDown className="h-4 w-4 text-zinc-600 shrink-0" />
            </div>
            <div className="flex items-center px-4 gap-3 flex-1 h-full bg-white dark:bg-zinc-900 relative">
              <Search className="h-5 w-5 text-zinc-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (pathname !== '/') router.push('/');
                  router.replace(`/?q=${e.target.value}`);
                }}
                placeholder="Search for restaurant or dish" 
                className="bg-transparent border-none outline-none w-full text-[15px] text-zinc-800 dark:text-white placeholder:text-zinc-400 h-full" 
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 shrink-0">
            
            {session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 outline-none hover:bg-zinc-50 dark:hover:bg-zinc-900 p-1.5 rounded-full pr-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 font-bold text-lg border border-orange-200 dark:border-orange-800/50">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-[16px] hidden sm:block text-zinc-800 dark:text-zinc-200">{session.user.name.split(" ")[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="font-bold text-[15px] text-zinc-900 dark:text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
                    </div>
                    
                    <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <ShoppingBag className="w-4 h-4 mr-3 text-zinc-400" /> My Orders
                    </Link>
                    
                    {session.user.role === 'store_owner' && (
                      <Link href="/store-admin" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <LayoutDashboard className="w-4 h-4 mr-3 text-zinc-400" /> Store Dashboard
                      </Link>
                    )}
                    
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-4"></div>
                    
                    <button onClick={() => { setDropdownOpen(false); signOutAction(); }} className="w-full flex items-center px-4 py-2.5 text-[15px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <LogOut className="w-4 h-4 mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[17px] font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-[17px] font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Functional Cart Drawer */}
            <div className="ml-2">
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
