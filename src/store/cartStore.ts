import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
}

interface CartStore {
  items: CartItem[];
  storeId: string | null;
  userId: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  syncUser: (newUserId: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      storeId: null,
      userId: null,
      
      syncUser: (newUserId) => {
        const currentUserId = get().userId;
        // If a new user logs in (or logs out), and it's different from the cart's owner, clear the cart.
        if (currentUserId !== null && newUserId !== currentUserId) {
          set({ items: [], storeId: null, userId: newUserId });
        } else if (currentUserId === null && newUserId !== null) {
          // If cart was created while logged out, assign it to the new user now
          set({ userId: newUserId });
        }
      },

      addItem: (newItem) => {
        const { items, storeId } = get();
        
        if (storeId && storeId !== newItem.storeId) {
          if (!window.confirm("Adding this item will clear your current cart from another store. Proceed?")) {
            return;
          }
          set({ items: [{ ...newItem, quantity: 1 }], storeId: newItem.storeId });
          return;
        }

        const existingItem = items.find((item) => item._id === newItem._id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === newItem._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            storeId: newItem.storeId,
          });
        } else {
          set({ 
            items: [...items, { ...newItem, quantity: 1 }],
            storeId: newItem.storeId
          });
        }
      },
      
      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item._id !== itemId);
        set({
          items: newItems,
          storeId: newItems.length === 0 ? null : get().storeId,
        });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [], storeId: null }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'food-ordering-cart',
    }
  )
);
