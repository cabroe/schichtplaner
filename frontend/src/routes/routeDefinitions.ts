import { lazy } from 'react';

// Lazy Loading für Seiten
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Times = lazy(() => import('../pages/Times'));
const Settings = lazy(() => import('../pages/Settings'));
const ModalDemo = lazy(() => import('../pages/ModalDemo'));
const ToastDemo = lazy(() => import('../pages/ToastDemo'));
const ContextMenuDemo = lazy(() => import('../pages/ContextMenuDemo'));
const DataTableDemo = lazy(() => import('../pages/DataTableDemo'));
const ShiftPlanning = lazy(() => import('../pages/ShiftPlanning'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const About = lazy(() => import('../pages/About'));
const UserManagement = lazy(() => import('../pages/UserManagement'));
// NotFound wird direkt in App.tsx importiert

export interface RouteDefinition {
  path: string;
  component: React.ComponentType;
  title: string;
  protected?: boolean;
  template?: 'main' | 'simple';
}

export const publicRoutes: RouteDefinition[] = [
  {
    path: '/login',
    component: LoginPage,
    title: 'Anmelden',
    template: 'simple'
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
    title: 'Passwort zurücksetzen',
    template: 'simple'
  },
  {
    path: '/about',
    component: About,
    title: 'Über Schichtplaner',
    template: 'main'
  }
];

export const protectedRoutes: RouteDefinition[] = [
  {
    path: '/',
    component: Dashboard,
    title: 'Dashboard',
    protected: true,
    template: 'main'
  },
  {
    path: '/times',
    component: Times,
    title: 'Zeiten',
    protected: true,
    template: 'main'
  },
  {
    path: '/shift-planning',
    component: ShiftPlanning,
    title: 'Schichtplanung',
    protected: true,
    template: 'main'
  },
  {
    path: '/settings',
    component: Settings,
    title: 'Einstellungen',
    protected: true,
    template: 'main'
  },

  {
    path: '/admin/users',
    component: UserManagement,
    title: 'Benutzer-Verwaltung',
    protected: true,
    template: 'main'
  },
  {
    path: '/modal-demo',
    component: ModalDemo,
    title: 'Modal Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/toast-demo',
    component: ToastDemo,
    title: 'Toast Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/context-menu-demo',
    component: ContextMenuDemo,
    title: 'Context Menu Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/data-table-demo',
    component: DataTableDemo,
    title: 'Data Table Demo',
    protected: true,
    template: 'main'
  }
];

export const allRoutes = [...publicRoutes, ...protectedRoutes];

export const getRouteByPath = (path: string): RouteDefinition | undefined => {
  return allRoutes.find(route => route.path === path);
};

export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.protected ?? false;
}; 