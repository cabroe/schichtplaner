import { lazy } from 'react';

// Lazy Loading für Seiten
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Times = lazy(() => import('../pages/Times'));
const Settings = lazy(() => import('../pages/Settings'));
const ModalDemo = lazy(() => import('../pages/ModalDemo'));
const ToastDemo = lazy(() => import('../pages/ToastDemo'));
const ContextMenuDemo = lazy(() => import('../pages/ContextMenuDemo'));
const DataTableDemo = lazy(() => import('../pages/DataTableDemo'));
const FormDemo = lazy(() => import('../pages/FormDemo'));
const ShiftPlanning = lazy(() => import('../pages/ShiftPlanning'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const About = lazy(() => import('../pages/About'));
const User = lazy(() => import('../pages/User'));

// Neue Komponenten Demos
const AccordionDemoNeu = lazy(() => import('../pages/AccordionDemo-neu'));
const AvatarDemoNeu = lazy(() => import('../pages/AvatarDemo-neu'));
const BadgeDemoNeu = lazy(() => import('../pages/BadgeDemo-neu'));
const ButtonDemoNeu = lazy(() => import('../pages/ButtonDemo-neu'));
const CalendarDemoNeu = lazy(() => import('../pages/CalendarDemo-neu'));
const CardDemoNeu = lazy(() => import('../pages/CardDemo-neu'));
const ContainerDemoNeu = lazy(() => import('../pages/ContainerDemo-neu'));
const DataTableDemoNeu = lazy(() => import('../pages/datatabledemo-neu'));
const DividerDemoNeu = lazy(() => import('../pages/DividerDemo-neu'));
const DropdownDemoNeu = lazy(() => import('../pages/DropdownDemo-neu'));
const IconDemoNeu = lazy(() => import('../pages/IconDemo-neu'));
const LabelDemoNeu = lazy(() => import('../pages/LabelDemo-neu'));
const LoadingSpinnerDemoNeu = lazy(() => import('../pages/LoadingSpinnerDemo-neu'));
const ModalDemoNeu = lazy(() => import('../pages/ModalDemo-neu'));
const ProgressBarDemoNeu = lazy(() => import('../pages/ProgressBarDemo-neu'));
const StepperDemoNeu = lazy(() => import('../pages/StepperDemo-neu'));
const TabsDemoNeu = lazy(() => import('../pages/TabsDemo-neu'));
const TimelineDemoNeu = lazy(() => import('../pages/TimelineDemo-neu'));
const ToastDemoNeu = lazy(() => import('../pages/ToastDemo-neu'));
const TooltipDemoNeu = lazy(() => import('../pages/TooltipDemo-neu'));
const UserDropdownDemoNeu = lazy(() => import('../pages/UserDropdownDemo-neu'));
const UserLabelDemoNeu = lazy(() => import('../pages/UserLabelDemo-neu'));

// NotFound wird direkt in App.tsx importiert

export interface RouteDefinition {
  path: string;
  component: React.ComponentType;
  title: string;
  protected?: boolean;
  template?: 'main' | 'simple';
  /** Optionaler Status, der im Header angezeigt wird */
  status?: {
    /** Status-Text oder Inhalt */
    content: React.ReactNode;
    /** Status-Variante (Farbe) */
    variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'teal' | 'purple' | 'pink' | 'yellow' | 'orange' | 'green' | 'blue' | 'red' | 'gray';
    /** Status-Größe */
    size?: 'sm' | 'md' | 'lg';
  };
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
    component: User,
    title: 'Benutzer-Verwaltung',
    protected: true,
    template: 'main'
  },
  // Alte Demos
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
  },
  {
    path: '/form-demo',
    component: FormDemo,
    title: 'Form Demo',
    protected: true,
    template: 'main'
  },
  // Neue Komponenten Demos
  {
    path: '/accordion-demo-neu',
    component: AccordionDemoNeu,
    title: 'Accordion Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/avatar-demo-neu',
    component: AvatarDemoNeu,
    title: 'Avatar Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/badge-demo-neu',
    component: BadgeDemoNeu,
    title: 'Badge Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/button-demo-neu',
    component: ButtonDemoNeu,
    title: 'Button Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/calendar-demo-neu',
    component: CalendarDemoNeu,
    title: 'Calendar Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/card-demo-neu',
    component: CardDemoNeu,
    title: 'Card Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/container-demo-neu',
    component: ContainerDemoNeu,
    title: 'Container Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/data-table-demo-neu',
    component: DataTableDemoNeu,
    title: 'DataTable Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/divider-demo-neu',
    component: DividerDemoNeu,
    title: 'Divider Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/dropdown-demo-neu',
    component: DropdownDemoNeu,
    title: 'Dropdown Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/icon-demo-neu',
    component: IconDemoNeu,
    title: 'Icon Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/label-demo-neu',
    component: LabelDemoNeu,
    title: 'Label Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/loading-spinner-demo-neu',
    component: LoadingSpinnerDemoNeu,
    title: 'Loading Spinner Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/modal-demo-neu',
    component: ModalDemoNeu,
    title: 'Modal Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/progress-bar-demo-neu',
    component: ProgressBarDemoNeu,
    title: 'Progress Bar Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/stepper-demo-neu',
    component: StepperDemoNeu,
    title: 'Stepper Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/tabs-demo-neu',
    component: TabsDemoNeu,
    title: 'Tabs Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/timeline-demo-neu',
    component: TimelineDemoNeu,
    title: 'Timeline Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/toast-demo-neu',
    component: ToastDemoNeu,
    title: 'Toast Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/tooltip-demo-neu',
    component: TooltipDemoNeu,
    title: 'Tooltip Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/user-dropdown-demo-neu',
    component: UserDropdownDemoNeu,
    title: 'User Dropdown Demo',
    protected: true,
    template: 'main'
  },
  {
    path: '/user-label-demo-neu',
    component: UserLabelDemoNeu,
    title: 'User Label Demo',
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