import { ReactNode } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAlt, faClock, faCog } from '@fortawesome/free-solid-svg-icons';

export interface NavigationSubItem {
  href: string;
  title: string;
  active: boolean;
}

export interface NavigationItem {
  id: string;
  href: string;
  title: string;
  icon?: ReactNode;
  faIcon?: IconDefinition;
  isActive?: boolean;
  isDropdown?: boolean;
  ariaExpanded?: boolean;
  dropdownItems?: NavigationSubItem[];
}

export const defaultNavigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    title: "Dashboard",
    faIcon: faTachometerAlt,
    isActive: false,
    isDropdown: false
  },
  {
    id: "zeiterfassung",
    href: "/zeiterfassung",
    title: "Zeiterfassung",
    faIcon: faClock,
    isActive: false,
    isDropdown: true,
    dropdownItems: [
      { href: "/zeiterfassung/meine-zeiten", title: "Meine Zeiten", active: true },
      { href: "/zeiterfassung/kalender", title: "Kalender", active: false },
      { href: "/zeiterfassung/export", title: "Export", active: false },
      { href: "/zeiterfassung/alle-zeiten", title: "Alle Zeiten", active: false }
    ]
  },
  {
    id: "administration",
    href: "/administration",
    title: "Administration",
    faIcon: faCog,
    isActive: false,
    isDropdown: true,
    dropdownItems: [
      { href: "/administration/kunden", title: "Kunden", active: false },
      { href: "/administration/projekte", title: "Projekte", active: false },
      { href: "/administration/taetigkeiten", title: "Tätigkeiten", active: false }
    ]
  }
];
