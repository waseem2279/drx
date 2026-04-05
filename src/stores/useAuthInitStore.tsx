import { create } from "zustand";

interface AuthInitStoreState {
  isAuthReady: boolean;
  setIsAuthReady: (isReady: boolean) => void;
}

const useAuthInitStore = create<AuthInitStoreState>((set) => ({
  isAuthReady: false,
  setIsAuthReady: (isReady: boolean) => set({ isAuthReady: isReady }),
}));

// Selectors
export const useIsAuthReady = () =>
  useAuthInitStore((state) => state.isAuthReady);

export const useSetIsAuthReady = () =>
  useAuthInitStore((state) => state.setIsAuthReady);
