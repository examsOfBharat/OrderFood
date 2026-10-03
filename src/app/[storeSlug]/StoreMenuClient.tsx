"use client";

import { useCartStore } from "@/store/cartStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Minus, Search } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function StoreMenuClient({ store, categories, items, userId }: { store: any, categories: any[], items: any[], userId: string | null }) {
  const { addItem, updateQuantity, items: cartItems, syncUser } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    syncUser(userId);
  }, [userId, syncUser]);

  const getQuantity = (itemId: string) => {
    if (!isMounted) return 0;
    return cartItems.find(i => i._id === itemId)?.quantity || 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const filteredCategories = selectedCategory 
    ? categories.filter(c => c._id === selectedCategory) 
    : categories;

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-10 items-start pb-20">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block sticky top-24 w-[250px] shrink-0 border-r pr-4 pb-8 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
        <button 
          onClick={() => handleCategoryClick(null)}
          className={`block px-4 py-3 text-[15px] text-left w-full font-semibold border-r-2 transition-all ${selectedCategory === null ? 'border-zinc-900 text-zinc-900 bg-zinc-50' : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}`}
        >
          All Items
        </button>
        {categories.map(category => (
          <button 
            key={category._id} 
            onClick={() => handleCategoryClick(category._id)}
            className={`block px-4 py-3 text-[15px] text-left w-full font-semibold border-r-2 transition-all ${selectedCategory === category._id ? 'border-zinc-900 text-zinc-900 bg-zinc-50' : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Mobile Sticky Header & Category Filter */}
      <div className="md:hidden sticky top-0 z-40 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800 -mx-4 w-screen max-w-[100vw]">
        {/* Mobile Horizontal Category Scroller */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2.5 items-center px-4 py-3.5 w-full">
          <button 
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={`shrink-0 px-5 py-2 rounded-full text-[14px] font-bold transition-all shadow-sm border ${selectedCategory === null ? 'bg-orange-600 border-orange-600 text-white shadow-orange-600/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
            All Items
          </button>
          {categories.map(category => (
            <button 
              key={category._id} 
              type="button"
              onClick={() => handleCategoryClick(category._id)}
              className={`shrink-0 px-5 py-2 rounded-full text-[14px] font-bold transition-all shadow-sm border ${selectedCategory === category._id ? 'bg-orange-600 border-orange-600 text-white shadow-orange-600/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="flex-1 w-full max-w-2xl pt-4 md:pt-0">
        {filteredCategories.map((category, index) => {
          const categoryItems = items.filter(item => item.category === category._id);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category._id} id={`cat-${category._id}`} className="scroll-mt-32">
              <div className="pb-4">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">{category.name} ({categoryItems.length})</h2>
              </div>
              
              <div className="flex flex-col">
                {categoryItems.map((item, itemIdx) => {
                  const quantity = getQuantity(item._id);
                  const isLast = itemIdx === categoryItems.length - 1;
                  
                  return (
                    <div key={item._id} className={`relative z-0 flex gap-4 py-8 ${!isLast ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}>
                      {/* Text Content */}
                      <div className="flex-1 space-y-1.5 pr-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`flex h-4 w-4 items-center justify-center rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                            <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                          </span>
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Bestseller
                          </span>
                        </div>
                        <h3 className="font-bold text-[17px] text-zinc-800 dark:text-zinc-200 leading-tight">{item.name}</h3>
                        <div className="font-bold text-[15px] text-zinc-900 dark:text-white pb-1">₹{item.price}</div>
                        <p className="text-[14px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                      </div>
                      
                      {/* Image & Action */}
                      <div className="relative w-[130px] h-[130px] shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center overflow-visible shadow-sm">
                        <div className="text-5xl opacity-40">🍽️</div>
                        
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[100px] z-10">
                          {quantity > 0 ? (
                            <div className="flex items-center justify-between bg-white border border-green-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl h-10 px-1 overflow-hidden font-black text-green-700">
                              <Button variant="ghost" size="icon" className="h-full w-8 rounded-none hover:bg-green-50 text-green-700" onClick={() => updateQuantity(item._id, quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-4 text-center">{quantity}</span>
                              <Button variant="ghost" size="icon" className="h-full w-8 rounded-none hover:bg-green-50 text-green-700" onClick={() => updateQuantity(item._id, quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="w-full h-10 rounded-xl font-black text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-green-700 bg-white hover:bg-zinc-50 transition-all uppercase tracking-wide border border-zinc-200 disabled:opacity-90 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:border-zinc-300" 
                              variant="outline"
                              disabled={!store.isOpen}
                              onClick={() => addItem({
                                _id: item._id,
                                name: item.name,
                                price: item.price,
                                storeId: store._id
                              })}
                            >
                              {store.isOpen ? "ADD" : "CLOSED"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Category divider except for last */}
              <div className="h-4 bg-zinc-100 border-y border-zinc-200 -mx-4 px-4 md:mx-0 md:px-0 my-4 md:bg-transparent md:border-y-0"></div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Menu is empty</h3>
            <p className="text-zinc-500 max-w-sm font-medium text-sm">This store hasn't added any items to their menu yet.</p>
          </div>
        )}
      </div>

      {/* Desktop Cart Float */}
      <div className="hidden md:flex flex-col sticky top-24 w-16 shrink-0 items-end">
        <CartDrawer />
      </div>

      {/* Mobile Floating Cart Bar (Zomato/Swiggy Style) */}
      {isMounted && totalItems > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Link href="/checkout" className="bg-green-700 text-white rounded-2xl shadow-[0_8px_30px_rgba(21,128,61,0.3)] p-4 flex items-center justify-between transition-transform active:scale-95">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold opacity-90 tracking-wider">{totalItems} ITEM{totalItems > 1 ? 'S' : ''}</span>
              <span className="font-bold text-[16px]">₹{totalPrice}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-[15px]">
              View Cart <ChevronRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
