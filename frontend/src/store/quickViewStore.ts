import { create } from 'zustand';
import { Product } from '../types/product';

interface QuickViewState {
  selectedProduct: Product | null;
  isOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  selectedProduct: null,
  isOpen: false,
  openQuickView: (product) => set({ selectedProduct: product, isOpen: true }),
  closeQuickView: () => set({ selectedProduct: null, isOpen: false }),
}));
