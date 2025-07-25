import DashboardHeader from "../pages/pageHeaders/DashboardHeader";
import TimesHeader from "../pages/pageHeaders/TimesHeader";
import SettingsHeader from "../pages/pageHeaders/SettingsHeader";
import ModalDemoHeader from "../pages/pageHeaders/ModalDemoHeader";
import ToastDemoHeader from "../pages/pageHeaders/ToastDemoHeader";
import ShiftPlanningHeader from "../pages/pageHeaders/ShiftPlanningHeader";
import UserHeader from "../pages/pageHeaders/UserHeader";

export type PageTitleEntry = {
  title: string;
  pretitle: string;
  icon: string;
  headerComponent?: React.FC;
  children?: Record<string, PageTitleEntry>;
};

export const routeConfig: Record<string, PageTitleEntry> = {
  "/": {
    title: "Dashboard",
    pretitle: "Willkommen",
    icon: "fas fa-dashboard",
    headerComponent: DashboardHeader,
  },
  "/times": {
    title: "Zeiten",
    pretitle: "Übersicht",
    icon: "fas fa-clock",
    headerComponent: TimesHeader,
  },
  "/shift-planning": {
    title: "Schichtplanung",
    pretitle: "Planung",
    icon: "fas fa-calendar-alt",
    headerComponent: ShiftPlanningHeader,
  },
  "/settings": {
    title: "Einstellungen",
    pretitle: "Benutzerprofil",
    icon: "fas fa-cog",
    headerComponent: SettingsHeader,
  },
  "/admin": {
    title: "Administration",
    pretitle: "Systemverwaltung",
    icon: "fas fa-shield-alt",
    children: {
      "/admin/users": {
        title: "Benutzer",
        pretitle: "Verwaltung",
        icon: "fas fa-users",
        headerComponent: UserHeader,
      },
    },
  },
  "/demos": {
    title: "Demos",
    pretitle: "Beispiele",
    icon: "fas fa-flask",
    children: {
      "/modal-demo": {
        title: "Modal Demo",
        pretitle: "Beispielseite",
        icon: "fas fa-window-restore",
        headerComponent: ModalDemoHeader,
      },
      "/toast-demo": {
        title: "Toast Demo",
        pretitle: "Beispielseite",
        icon: "fas fa-bell",
        headerComponent: ToastDemoHeader,
      },
      "/context-menu-demo": {
        title: "ContextMenu Demo",
        pretitle: "Beispielseite",
        icon: "fas fa-mouse-pointer",
      },
      "/data-table-demo": {
        title: "DataTable Demo",
        pretitle: "Beispielseite",
        icon: "fas fa-table",
      },
      "/form-demo": {
        title: "Form Demo",
        pretitle: "Beispielseite",
        icon: "fas fa-edit",
      },
      // Neue Komponenten Demos
      "/accordion-demo-neu": {
        title: "Accordion Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-chevron-down",
      },
      "/avatar-demo-neu": {
        title: "Avatar Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-user-circle",
      },
      "/badge-demo-neu": {
        title: "Badge Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-tag",
      },
      "/button-demo-neu": {
        title: "Button Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-square",
      },
      "/calendar-demo-neu": {
        title: "Calendar Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-calendar",
      },
      "/card-demo-neu": {
        title: "Card Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-credit-card",
      },
      "/container-demo-neu": {
        title: "Container Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-box",
      },
      "/data-table-demo-neu": {
        title: "DataTable Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-table",
      },
      "/divider-demo-neu": {
        title: "Divider Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-minus",
      },
      "/dropdown-demo-neu": {
        title: "Dropdown Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-chevron-down",
      },
      "/icon-demo-neu": {
        title: "Icon Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-icons",
      },
      "/label-demo-neu": {
        title: "Label Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-tag",
      },
      "/loading-spinner-demo-neu": {
        title: "Loading Spinner Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-spinner",
      },
      "/modal-demo-neu": {
        title: "Modal Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-window-restore",
      },
      "/progress-bar-demo-neu": {
        title: "Progress Bar Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-tasks",
      },
      "/stepper-demo-neu": {
        title: "Stepper Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-steps",
      },
      "/tabs-demo-neu": {
        title: "Tabs Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-folder",
      },
      "/timeline-demo-neu": {
        title: "Timeline Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-stream",
      },
      "/toast-demo-neu": {
        title: "Toast Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-bell",
      },
      "/tooltip-demo-neu": {
        title: "Tooltip Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-comment",
      },
      "/user-dropdown-demo-neu": {
        title: "User Dropdown Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-user",
      },
      "/user-label-demo-neu": {
        title: "User Label Demo",
        pretitle: "Neue Komponenten",
        icon: "fas fa-user-tag",
      },
    },
  },
};

export const userMenuItems = [
  { title: "Mein Profil", to: "/profile" },
  { title: "Bearbeiten", to: "/bearbeiten" },
  { title: "Passwort", to: "/password" },
  { title: "Zwei-Faktor (2FA)", to: "/2fa" },
  { title: "API Zugang", to: "/api" },
  { title: "Einstellungen", to: "/settings" },
  { divider: true },
  { title: "Abmelden", to: "/logout" },
]; 