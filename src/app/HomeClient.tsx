"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Star, Clock, Percent } from "lucide-react";

export function HomeClient({ stores }: { stores: any[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q") || "";

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <main className="flex-1">
      {/* Swiggy/Zomato Search Hero */}
      <section className="bg-white dark:bg-black pt-12 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center space-y-8">
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.2]">
            Order food & groceries. <span className="text-zinc-500 block sm:inline mt-2 sm:mt-0">Discover the best.</span>
          </h1>
          

        </div>
      </section>

      {/* What's on your mind? Carousel */}
      {!searchQuery && (
        <section className="bg-white dark:bg-black py-8 border-t border-zinc-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <h2 className="text-2xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">What's on your mind?</h2>
            
            <div className="flex overflow-x-auto hide-scrollbar gap-8 pb-4">
              {inspirationCategories.map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group">
                  <div className={`w-28 h-28 ${cat.color} rounded-full flex items-center justify-center text-5xl shadow-sm transition-transform group-hover:scale-105`}>
                    {cat.emoji}
                  </div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 text-[15px]">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stores Section */}
      <section id="stores-section" className="py-12 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <h2 className="text-2xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">
            {searchQuery ? `Search results for "${searchQuery}"` : "Top restaurants in your location"}
          </h2>
          
          {filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem]">
              <div className="text-6xl mb-6">🏜️</div>
              <h3 className="text-2xl font-bold mb-2">No restaurants found</h3>
              <p className="text-zinc-500 font-medium max-w-sm mb-6">
                {searchQuery ? `We couldn't find any stores matching "${searchQuery}".` : "There are currently no stores open. Check back later or open your own store!"}
              </p>
              {!searchQuery && (
                <Link href="/register" className="text-[15px] font-bold text-white bg-black dark:bg-white dark:text-black px-6 py-3 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  Become a Partner
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-x-8 md:gap-y-12">
              {filteredStores.map((store: any, i: number) => {
                
                return (
                  <Link href={`/${store.slug}`} key={store._id} className="group flex flex-col gap-3">
                    {/* Store Image Card */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-900 group-hover:scale-[0.98] transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-6xl opacity-80">
                        🍽️
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      
                      <div className="absolute bottom-2 left-3 right-3">
                        <span className="text-xl font-black tracking-tighter text-white uppercase drop-shadow-md">
                          50% OFF UPTO ₹100
                        </span>
                      </div>
                      
                      {!store.isOpen && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Closed</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Store Details */}
                    <div className="flex flex-col px-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1">{store.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="bg-green-700 text-white flex items-center justify-center rounded-full h-[18px] w-[18px]">
                          <Star className="h-3 w-3 fill-white" />
                        </div>
                        <span className="font-bold text-[15px] text-zinc-800 dark:text-zinc-200">4.{3 + (i % 6)}</span>
                        <span className="text-zinc-400 font-bold text-xs">•</span>
                        <span className="font-bold text-[15px] text-zinc-800 dark:text-zinc-200">25-30 mins</span>
                      </div>

                      <p className="text-[14px] text-zinc-500 font-medium line-clamp-1 mt-1">
                        {store.description || "North Indian, Chinese, Desserts"}
                      </p>
                      <p className="text-[14px] text-zinc-500 font-medium line-clamp-1 mt-0.5">
                        {store.address}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
