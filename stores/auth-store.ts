import { User } from '@/types';
import storage from '@/utils/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: storage,
    }
  )
);
