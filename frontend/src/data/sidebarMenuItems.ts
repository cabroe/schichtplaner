export interface MenuItem {
  id: string;
  path: string;
  title: string;
  icon: string;
  isDropdown?: boolean;
  children?: MenuItem[];
}

export const sidebarMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    id: 'about',
    path: '/about',
    title: 'Über uns',
    icon: 'fas fa-info-circle'
  },
  {
    id: 'modal-test',
    path: '/modal-test',
    title: 'Modal Test',
    icon: 'fas fa-window-restore'
  }/* ,
  {
    id: 'times',
    path: '#',
    title: 'Zeiterfassung',
    icon: 'fas fa-clock',
    isDropdown: true,
    children: [
      {
        id: 'timesheet',
        path: '/timesheet',
        title: 'Meine Zeiten',
        icon: 'fas fa-clock'
      },
      {
        id: 'quick_entry',
        path: '/quick_entry',
        title: 'Wochenstunden',
        icon: 'fas fa-th'
      },
      {
        id: 'calendar',
        path: '/calendar',
        title: 'Kalender',
        icon: 'fas fa-calendar'
      }
    ]
  } */
];
