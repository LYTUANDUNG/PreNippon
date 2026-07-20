import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  type: 'PREORDER' | 'AVAILABLE';
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const type = product.status === 'PREORDER' ? 'PREORDER' : 'AVAILABLE';
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, { product, quantity, type }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'prenippon-cart-storage',
    }
  )
);
