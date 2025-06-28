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
    href: "/dashboard/",
    title: "Dashboard",
    icon: <span>📊</span>,
    isActive: false,
    isDropdown: false
  },
  {
    id: "nav-dropdown-times",
    href: "#",
    title: "Zeiterfassung",
    icon: <span>🕐</span>,
    isActive: true,
    isDropdown: true,
    ariaExpanded: false
  },
  {
    id: "nav-dropdown-admin",
    href: "#",
    title: "Administration",
    icon: <span>⚙️</span>,
    isActive: false,
    isDropdown: true,
    ariaExpanded: false
  }
];
