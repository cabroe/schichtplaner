import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  openMenu: string | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  open: (menu: string) => void;
  close: () => void;
  isOpen: (menu: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<UiState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      openMenu: null,
      theme: 'dark',
      sidebarCollapsed: false,
      notifications: [],
      
      open: (menu) => set({ openMenu: menu }),
      close: () => set({ openMenu: null }),
      isOpen: (menu) => get().openMenu === menu,
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          }
        ]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
); 