import DashboardHeader from "../pages/pageHeaders/DashboardHeader";
import TimesHeader from "../pages/pageHeaders/TimesHeader";
import SettingsHeader from "../pages/pageHeaders/SettingsHeader";
import ModalDemoHeader from "../pages/pageHeaders/ModalDemoHeader";
import ToastDemoHeader from "../pages/pageHeaders/ToastDemoHeader";
import ShiftPlanningHeader from "../pages/pageHeaders/ShiftPlanningHeader";

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