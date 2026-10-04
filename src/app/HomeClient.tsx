"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, Clock, Percent, ArrowRight, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export function HomeClient({ stores }: { stores: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams?.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  // Sync local state if URL changes from outside (e.g., Navbar search)
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Filter instantly using local state for a snappy mobile experience
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/`);
    }
  };

  const inspirationCategories = [
    { name: "Biryani", emoji: "🥘", color: "bg-orange-100", textColor: "text-orange-900" },
    { name: "Pizza", emoji: "🍕", color: "bg-red-100", textColor: "text-red-900" },
    { name: "Burger", emoji: "🍔", color: "bg-yellow-100", textColor: "text-yellow-900" },
    { name: "Sweets", emoji: "🍩", color: "bg-pink-100", textColor: "text-pink-900" },
    { name: "Rolls", emoji: "🌯", color: "bg-amber-100", textColor: "text-amber-900" },
    { name: "Healthy", emoji: "🥗", color: "bg-green-100", textColor: "text-green-900" },
    { name: "Coffee", emoji: "☕", color: "bg-zinc-200", textColor: "text-zinc-900" },
    { name: "Ice Cream", emoji: "🍦", color: "bg-blue-100", textColor: "text-blue-900" },
  ];

  return (
    <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden bg-zinc-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/95 to-zinc-950"></div>
        
        {/* Floating elements animation (CSS driven - hidden on smallest screens to avoid clutter) */}
        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20 animate-pulse">🍕</div>
        <div className="hidden sm:block absolute bottom-20 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🍔</div>
        <div className="hidden md:block absolute top-40 right-1/4 text-5xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>🥗</div>

        <div className="relative container mx-auto px-4 max-w-5xl text-center space-y-6 sm:space-y-10 z-10">
          
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Cravings? <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Sorted.</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-zinc-300 font-medium max-w-2xl mx-auto px-2">
              Discover the best food and drinks from top restaurants around you.
            </p>
          </div>
          
          {/* Awesome Search Bar (Hidden on Desktop since Navbar has it) */}
          <form onSubmit={handleSearch} className="md:hidden max-w-2xl mx-auto relative group mt-2 sm:mt-0">
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                router.replace(`/?q=${encodeURIComponent(e.target.value)}`);
              }}
              placeholder="Search restaurants, cuisines..." 
              className="w-full h-12 sm:h-16 pl-10 sm:pl-14 pr-24 sm:pr-32 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/20 transition-all text-sm sm:text-lg font-medium shadow-2xl"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 sm:right-2 sm:top-2 sm:bottom-2 bg-orange-600 hover:bg-orange-500 text-white px-3 sm:px-6 rounded-lg sm:rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center text-sm sm:text-base">
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden">Go</span>
            </button>
          </form>

        </div>
      </section>

      {/* What's on your mind? Carousel */}
      {!searchQuery && (
        <section className="relative -mt-6 sm:-mt-10 z-20">
          <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] shadow-xl p-5 sm:p-8 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-4 sm:mb-8 text-zinc-900 dark:text-white">What's on your mind?</h2>
              
              <div className="flex overflow-x-auto hide-scrollbar gap-4 sm:gap-6 pb-2 sm:pb-4">
                {inspirationCategories.map((cat, idx) => (
                  <div key={idx} onClick={() => { setSearchQuery(cat.name); router.push(`/?q=${cat.name}`); }} className="flex flex-col items-center gap-2 sm:gap-3 shrink-0 cursor-pointer group">
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 ${cat.color} rounded-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                      {cat.emoji}
                    </div>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs sm:text-[15px] group-hover:text-orange-600 transition-colors">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stores Section */}
      <section id="stores-section" className="py-10 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-6 sm:mb-10 text-zinc-900 dark:text-white">
            {searchQuery ? (
              <span className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <span>Results for</span>
                <span className="text-orange-600">"{searchQuery}"</span>
              </span>
            ) : "Top restaurants near you"}
          </h2>
          
          {filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="text-6xl sm:text-7xl mb-4 sm:mb-6 opacity-80">🏜️</div>
              <h3 className="text-xl sm:text-2xl font-black mb-2 text-zinc-900 dark:text-white">Nothing found</h3>
              <p className="text-zinc-500 font-medium max-w-sm mb-6 sm:mb-8 text-sm sm:text-lg">
                {searchQuery ? `We couldn't find any stores matching "${searchQuery}". Try searching for something else!` : "There are currently no stores open. Check back later or open your own store!"}
              </p>
              {searchQuery ? (
                <button onClick={() => { setSearchQuery(""); router.push('/'); }} className="text-sm sm:text-[15px] font-bold text-white bg-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg">
                  Clear Search
                </button>
              ) : (
                <Link href="/register" className="text-sm sm:text-[15px] font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg flex items-center gap-2">
                  Become a Partner <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
              {filteredStores.map((store: any, i: number) => {
                
                return (
                  <Link href={`/${store.slug}`} key={store._id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 transform sm:hover:-translate-y-1">
                    {/* Store Image Card */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl opacity-50 group-hover:scale-110 transition-transform duration-500">
                        {['🍕', '🍔', '🥗', '🍣', '🍱', '🥘'][i % 6]}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
                      
                      {/* Offers Badge */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg shadow-sm flex items-center gap-1">
                        <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 50% OFF
                      </div>
                      
                      <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4">
                        <h3 className="text-lg sm:text-xl font-black tracking-tight text-white line-clamp-1">{store.name}</h3>
                        <p className="text-xs sm:text-[13px] text-zinc-300 font-medium line-clamp-1 mt-0.5">
                          {store.description || "North Indian, Chinese, Desserts"}
                        </p>
                      </div>
                      
                      {!store.isOpen && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <span className="bg-black text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl uppercase tracking-wider shadow-lg">Currently Closed</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Store Details Bottom */}
                    <div className="flex flex-col p-3 sm:p-4 bg-white dark:bg-zinc-900">
                      
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg">
                          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                          <span className="font-bold text-xs sm:text-sm">4.{3 + (i % 6)}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>25-30 mins</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1 sm:gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 font-medium leading-relaxed">{store.address}</span>
                      </div>
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
