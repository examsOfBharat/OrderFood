"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, Clock, MapPin, ArrowRight, X, Percent, Tag } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────
interface Store {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  isOpen?: boolean;
  cuisines?: string[];       // category names from DB
  menuPreview?: string[];    // menu item names from DB
  rating?: number;
}

// ─── Search helpers ──────────────────────────────────────────────────────
const FOOD_CATEGORY_ALIASES: Record<string, string[]> = {
  biryani:   ["biryani", "rice", "pulao", "dum"],
  pizza:     ["pizza", "pizzeria", "italian"],
  burger:    ["burger", "burgers", "sandwich", "sub", "wraps"],
  chinese:   ["chinese", "noodles", "momos", "dimsums", "manchurian", "chowmein"],
  sweets:    ["sweets", "mithai", "halwa", "gulab", "kheer", "dessert"],
  rolls:     ["rolls", "kati", "wrap", "frankie"],
  healthy:   ["healthy", "salad", "smoothie", "protein", "diet", "vegan"],
  coffee:    ["coffee", "cafe", "tea", "beverages", "latte", "cappuccino"],
  icecream:  ["ice cream", "icecream", "gelato", "kulfi", "shake", "milkshake"],
  thali:     ["thali", "meal", "north indian", "south indian"],
  chicken:   ["chicken", "tandoori", "grilled", "kebab", "tikka"],
  paneer:    ["paneer", "vegetarian", "veg", "cottage cheese"],
  seafood:   ["seafood", "fish", "prawn", "crab", "shrimp"],
  breakfast: ["breakfast", "paratha", "idli", "dosa", "upma", "poha"],
};

function expandQuery(query: string): string[] {
  const q = query.toLowerCase().trim();
  const terms = [q];
  for (const [, aliases] of Object.entries(FOOD_CATEGORY_ALIASES)) {
    if (aliases.some((a) => a.includes(q) || q.includes(a))) {
      terms.push(...aliases);
    }
  }
  return [...new Set(terms)];
}

function scoreStore(store: Store, terms: string[]): number {
  let score = 0;
  const haystack = [
    store.name,
    store.description,
    ...(store.cuisines ?? []),
    ...(store.menuPreview ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const term of terms) {
    if (!term) continue;
    if (store.name.toLowerCase().includes(term)) score += 10;
    if ((store.description ?? "").toLowerCase().includes(term)) score += 5;
    if ((store.cuisines ?? []).some((c) => c.toLowerCase().includes(term))) score += 8;
    if ((store.menuPreview ?? []).some((m) => m.toLowerCase().includes(term))) score += 4;
  }
  return score;
}

// ─── Static category chips ───────────────────────────────────────────────
const CATEGORIES = [
  { name: "Biryani",   emoji: "🥘", bg: "bg-orange-50",  ring: "ring-orange-200",  text: "text-orange-700"  },
  { name: "Pizza",     emoji: "🍕", bg: "bg-red-50",     ring: "ring-red-200",     text: "text-red-700"     },
  { name: "Burger",    emoji: "🍔", bg: "bg-yellow-50",  ring: "ring-yellow-200",  text: "text-yellow-700"  },
  { name: "Sweets",    emoji: "🍩", bg: "bg-pink-50",    ring: "ring-pink-200",    text: "text-pink-700"    },
  { name: "Rolls",     emoji: "🌯", bg: "bg-amber-50",   ring: "ring-amber-200",   text: "text-amber-700"   },
  { name: "Healthy",   emoji: "🥗", bg: "bg-green-50",   ring: "ring-green-200",   text: "text-green-700"   },
  { name: "Coffee",    emoji: "☕", bg: "bg-stone-50",   ring: "ring-stone-200",   text: "text-stone-700"   },
  { name: "Ice Cream", emoji: "🍦", bg: "bg-blue-50",    ring: "ring-blue-200",    text: "text-blue-700"    },
  { name: "Chinese",   emoji: "🍜", bg: "bg-purple-50",  ring: "ring-purple-200",  text: "text-purple-700"  },
  { name: "Chicken",   emoji: "🍗", bg: "bg-rose-50",    ring: "ring-rose-200",    text: "text-rose-700"    },
  { name: "Thali",     emoji: "🍱", bg: "bg-lime-50",    ring: "ring-lime-200",    text: "text-lime-700"    },
  { name: "Breakfast", emoji: "🥞", bg: "bg-sky-50",     ring: "ring-sky-200",     text: "text-sky-700"     },
];

// ─── Component ───────────────────────────────────────────────────────────
export function HomeClient({ stores }: { stores: Store[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams?.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [inputValue, setInputValue]   = useState(urlQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when URL changes from outside (e.g. navbar)
  useEffect(() => {
    setSearchQuery(urlQuery);
    setInputValue(urlQuery);
  }, [urlQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounce URL sync (so URL doesn't flicker on every keystroke)
  const handleInputChange = useCallback((val: string) => {
    setInputValue(val);
    setSearchQuery(val);           // instant local filter
    setShowSuggestions(val.length > 0);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(val.trim() ? `/?q=${encodeURIComponent(val)}` : "/", { scroll: false });
    }, 300);
  }, [router]);

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    setShowSuggestions(false);
    router.replace("/", { scroll: false });
  };

  const handleCategoryClick = (name: string) => {
    setInputValue(name);
    setSearchQuery(name);
    setShowSuggestions(false);
    router.replace(`/?q=${encodeURIComponent(name)}`, { scroll: false });
  };

  // ── Rich multi-field search with scoring ──
  const filteredStores = (() => {
    if (!searchQuery.trim()) return stores;
    const terms = expandQuery(searchQuery);
    return stores
      .map((s) => ({ store: s, score: scoreStore(s, terms) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.store);
  })();

  // Suggestions: category chips that match the typed query
  const suggestedCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(inputValue.toLowerCase()) && inputValue.length > 0
  );

  // Suggestion store names (top 4)
  const suggestedStores = stores
    .filter(
      (s) =>
        s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        inputValue.length > 1
    )
    .slice(0, 4);

  const storeEmojis = ["🍕", "🍔", "🥗", "🍣", "🍱", "🥘", "🍜", "🍗"];

  return (
    <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-24 sm:pb-32 overflow-hidden bg-zinc-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/95 to-zinc-950" />
        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20 animate-pulse">🍕</div>
        <div className="hidden sm:block absolute bottom-20 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: "3s" }}>🍔</div>
        <div className="hidden md:block absolute top-40 right-1/4 text-5xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🥗</div>

        <div className="relative container mx-auto px-4 max-w-4xl text-center space-y-7 sm:space-y-10 z-10">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Cravings?{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Sorted.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-zinc-300 font-medium max-w-lg mx-auto">
              Search by restaurant name, dish, or cuisine — we'll find it instantly.
            </p>
          </div>

          {/* ── Search Bar: only on mobile (navbar has it on desktop) ── */}
          <div ref={searchRef} className="md:hidden max-w-2xl mx-auto relative">
            <div className={`relative flex items-center h-13 sm:h-16 bg-white dark:bg-zinc-900 rounded-2xl overflow-visible shadow-2xl transition-all duration-200 ${showSuggestions ? "ring-2 ring-orange-500" : ""}`}>
              <Search className="absolute left-4 sm:left-5 h-5 w-5 text-zinc-400 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
                placeholder="Search restaurants, dishes, biryani, pizza..."
                className="w-full h-full pl-11 sm:pl-14 pr-28 sm:pr-36 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm sm:text-base font-medium focus:outline-none rounded-2xl"
              />
              {inputValue && (
                <button
                  onClick={handleClear}
                  className="absolute right-[6.5rem] sm:right-32 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-300" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  router.replace(inputValue.trim() ? `/?q=${encodeURIComponent(inputValue)}` : "/");
                }}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 rounded-xl font-bold transition-all shadow-lg text-sm sm:text-base"
              >
                Search
              </button>
            </div>

            {/* ── Suggestion Dropdown ── */}
            {showSuggestions && (suggestedCategories.length > 0 || suggestedStores.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">

                {suggestedCategories.length > 0 && (
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedCategories.map((cat) => (
                        <button
                          key={cat.name}
                          onMouseDown={() => handleCategoryClick(cat.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${cat.bg} ${cat.text} ring-1 ${cat.ring} hover:scale-105 transition-transform`}
                        >
                          <span>{cat.emoji}</span> {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestedStores.length > 0 && (
                  <div className="px-4 pt-2 pb-3">
                    {suggestedCategories.length > 0 && <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-2" />}
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Restaurants</p>
                    {suggestedStores.map((store) => (
                      <button
                        key={store._id}
                        onMouseDown={() => {
                          setShowSuggestions(false);
                          router.push(`/${store.slug}`);
                        }}
                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-lg shrink-0">
                          {storeEmojis[0]}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{store.name}</p>
                          {store.cuisines && store.cuisines.length > 0 && (
                            <p className="text-xs text-zinc-400 truncate">{store.cuisines.join(", ")}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick search pills */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 pt-2">
            {["Biryani", "Pizza", "Burger", "Chicken", "Chinese"].map((q) => (
              <button
                key={q}
                onClick={() => handleCategoryClick(q)}
                className="text-xs sm:text-sm font-semibold text-zinc-300 bg-white/10 hover:bg-orange-500/80 hover:text-white px-3 py-1.5 rounded-full border border-white/15 transition-all hover:border-orange-500"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Chips (hidden when searching) ─────────────── */}
      {!searchQuery && (
        <section className="relative -mt-8 sm:-mt-12 z-20">
          <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] shadow-xl p-5 sm:p-8 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-5 sm:mb-7 text-zinc-900 dark:text-white">
                What's on your mind? 🤔
              </h2>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 sm:gap-5 pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex flex-col items-center gap-2 sm:gap-3 shrink-0 group cursor-pointer"
                  >
                    <div className={`w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] ${cat.bg} ring-2 ${cat.ring} rounded-full flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      {cat.emoji}
                    </div>
                    <span className={`font-bold text-xs sm:text-sm ${cat.text} group-hover:opacity-80 transition-opacity`}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Stores Grid ────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              {searchQuery ? (
                <span className="flex flex-wrap items-center gap-2">
                  Results for
                  <span className="text-orange-500">"{searchQuery}"</span>
                  <span className="text-lg font-semibold text-zinc-400">
                    ({filteredStores.length} {filteredStores.length === 1 ? "restaurant" : "restaurants"})
                  </span>
                </span>
              ) : (
                "Top restaurants near you 🔥"
              )}
            </h2>
            {searchQuery && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-all shrink-0"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="text-7xl mb-5 opacity-70">🏜️</div>
              <h3 className="text-2xl font-black mb-2 text-zinc-900 dark:text-white">No results found</h3>
              <p className="text-zinc-500 font-medium max-w-sm mb-8 text-base">
                We couldn't find any restaurant matching <span className="font-bold text-zinc-700 dark:text-zinc-300">"{searchQuery}"</span>. Try a different dish or cuisine.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {["Biryani", "Pizza", "Burger", "Chinese"].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleCategoryClick(q)}
                    className="text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 px-4 py-2 rounded-xl transition-colors border border-orange-200 dark:border-orange-900/50"
                  >
                    Try "{q}"
                  </button>
                ))}
              </div>
              <button
                onClick={handleClear}
                className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
              >
                Show all restaurants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredStores.map((store, i) => (
                <Link
                  href={`/${store.slug}`}
                  key={store._id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 sm:hover:-translate-y-1"
                >
                  {/* Store Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                      {storeEmojis[i % storeEmojis.length]}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Percent className="w-2.5 h-2.5" /> 50% OFF
                    </div>

                    {/* Cuisine tags */}
                    {store.cuisines && store.cuisines.length > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                        {store.cuisines.slice(0, 2).map((c) => (
                          <span key={c} className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1">{store.name}</h3>
                      <p className="text-xs text-zinc-300 font-medium line-clamp-1 mt-0.5">
                        {store.cuisines && store.cuisines.length > 0
                          ? store.cuisines.join(" · ")
                          : store.description || "Delicious food"}
                      </p>
                    </div>

                    {!store.isOpen && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider">
                          Closed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Store details */}
                  <div className="flex flex-col p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="font-bold text-xs">{store.rating ? store.rating.toFixed(1) : `4.${3 + (i % 6)}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        <span>25–35 min</span>
                      </div>
                    </div>
                    {store.address && (
                      <div className="flex items-start gap-1.5 text-zinc-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 font-medium">{store.address}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
