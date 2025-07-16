import { create } from 'zustand';

interface UiState {
  openMenu: string | null;
  open: (menu: string) => void;
  close: () => void;
  isOpen: (menu: string) => boolean;
}

export const useUiStore = create<UiState>((set, get) => ({
  openMenu: null,
  open: (menu: string) => set({ openMenu: menu }),
  close: () => set({ openMenu: null }),
  isOpen: (menu: string) => get().openMenu === menu,
})); 