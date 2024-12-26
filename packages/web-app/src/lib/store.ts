import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  title?: string;
  profileImage?: string;
  location?: {
    id: number;
    name: string;
  };
  reportsTo?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
};

type UserSlice = {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
};

const useStore = create<UserSlice>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: User) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useStore;
