"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search, ChevronDown, LogOut,
  LayoutDashboard, X, Menu, Package, User as UserIcon,
  ShoppingBag,
} from "lucide-react";
import { signOutAction } from "@/app/actions";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "./CartDrawer";

export function NavbarClient({ session }: { session: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  if (
    pathname?.startsWith("/store-admin") ||
    pathname?.startsWith("/checkout") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    router.replace(q.trim() ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "?";
  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <>
      {/* ══════════════════════════════════
           MAIN NAVBAR
      ══════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_1px_12px_rgba(0,0,0,0.05)]" />

        <div className="relative container mx-auto px-5 lg:px-10 max-w-7xl">
          <div className="flex items-center h-[68px] gap-4">

            {/* ── LOGO ── */}
            <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
                <span className="text-base">🍔</span>
              </div>
              <span className="font-black text-[1.4rem] tracking-tighter text-zinc-900 dark:text-white">
                <span className="text-orange-500">Local</span>Bites
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block h-7 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {/* ── DESKTOP SEARCH (hidden on mobile) ── */}
            <div className={`hidden md:flex flex-1 max-w-2xl items-center h-11 rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
              searchFocused
                ? "border-orange-500 shadow-lg shadow-orange-500/10 bg-white dark:bg-zinc-900"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}>
              <Search className={`ml-4 h-4.5 w-4.5 shrink-0 transition-colors duration-200 ${searchFocused ? "text-orange-500" : "text-zinc-400"}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search restaurants, dishes, cuisines..."
                className="flex-1 h-full px-3 bg-transparent text-[14.5px] font-medium text-zinc-800 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="mr-3 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors shrink-0"
                >
                  <X className="h-3 w-3 text-zinc-500 dark:text-zinc-300" />
                </button>
              )}
            </div>

            {/* SPACER pushes right items to the end on mobile */}
            <div className="flex-1 md:hidden" />

            {/* ══ RIGHT SECTION ══ */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Cart — always visible on all screen sizes */}
              <CartDrawer />

              {/* ── DESKTOP: User menu OR Login/Signup ── */}
              <div className="hidden md:flex items-center gap-2">
                {session?.user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                        dropdownOpen ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                        {userInitial}
                      </div>
                      <span className="hidden lg:block font-semibold text-[13.5px] text-zinc-800 dark:text-zinc-200 max-w-[90px] truncate">
                        {firstName}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 border-b border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black shrink-0">
                              {userInitial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{session.user.name}</p>
                              <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <Package className="w-4 h-4 text-zinc-400" /> My Orders
                          </Link>
                          {session.user.role === "store_owner" && (
                            <Link href="/store-admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-zinc-400" /> Store Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-3" />

                        <div className="py-1">
                          <button onClick={() => { setDropdownOpen(false); signOutAction(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-[13.5px] font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                      Log in
                    </Link>
                    <Link href="/register" className="text-[13.5px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-5 py-2 rounded-xl shadow-md shadow-orange-500/25 transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 whitespace-nowrap">
                      Sign up free
                    </Link>
                  </>
                )}
              </div>

              {/* ── MOBILE: Hamburger only ── */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
           MOBILE SLIDE-IN DRAWER
      ══════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[78vw] max-w-[320px] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <span className="font-black text-lg tracking-tighter text-zinc-900 dark:text-white">
                <span className="text-orange-500">Local</span>Bites
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl px-3 h-11 focus-within:border-orange-500 transition-colors">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search restaurants..."
                  className="flex-1 bg-transparent text-sm font-medium text-zinc-800 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => handleSearch("")}>
                    <X className="h-3.5 w-3.5 text-zinc-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer nav content */}
            <div className="flex-1 overflow-y-auto">
              {session?.user ? (
                <div className="px-4 py-4 space-y-1">
                  {/* User card */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 rounded-2xl mb-4 border border-orange-100 dark:border-orange-900/30">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-orange-500/20">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session.user.email}</p>
                    </div>
                  </div>

                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">
                    <Package className="w-4 h-4 text-orange-500" />
                    My Orders
                  </Link>

                  {session.user.role === "store_owner" && (
                    <Link href="/store-admin" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-orange-500" />
                      Store Dashboard
                    </Link>
                  )}

                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 !my-3" />

                  <button
                    onClick={() => { setMobileMenuOpen(false); signOutAction(); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 font-semibold text-sm transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-sm transition-colors border border-zinc-200 dark:border-zinc-800">
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    Log in to your account
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                    🚀 Create a free account
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
              <p className="text-xs text-zinc-400 text-center font-medium">© 2024 LocalBites</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
