import { create } from 'zustand';

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

const createUserSlice: import('zustand').StateCreator<UserSlice> = (set) => ({
  user: null,
  setUser: (userData: User) => set({ user: userData }),
  clearUser: () => set({ user: null }),
});

const useStore = create<UserSlice>()((...args) => ({
  ...createUserSlice(...args),
}));

export default useStore;
