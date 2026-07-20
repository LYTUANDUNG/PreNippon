import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  updateUserTier: (tier: User['tier']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUserPoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, rewardPoints: points } : null,
        })),
      updateUserTier: (tier) =>
        set((state) => ({
          user: state.user ? { ...state.user, tier: tier } : null,
        })),
    }),
    {
      name: 'prenippon-auth-storage',
    }
  )
);
