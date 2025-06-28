import { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  href: string;
  title: string;
  icon?: ReactNode;
  isActive?: boolean;
  isDropdown?: boolean;
  ariaExpanded?: boolean;
}

export const defaultNavigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    title: "Dashboard",
    icon: <span>📊</span>,
    isActive: false,
    isDropdown: false
  },
  {
    id: "zeiterfassung",
    href: "/zeiterfassung",
    title: "Zeiterfassung",
    icon: <span>🕐</span>,
    isActive: false,
    isDropdown: false
  },
  {
    id: "administration",
    href: "/administration",
    title: "Administration",
    icon: <span>⚙️</span>,
    isActive: false,
    isDropdown: false
  }
];
