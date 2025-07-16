import { describe, it, expect } from "vitest";
import { routeConfig } from "./routeConfig";
import DashboardHeader from "../pages/pageHeaders/DashboardHeader";
import TimesHeader from "../pages/pageHeaders/TimesHeader";
import SettingsHeader from "../pages/pageHeaders/SettingsHeader";
import ModalDemoHeader from "../pages/pageHeaders/ModalDemoHeader";
import ToastDemoHeader from "../pages/pageHeaders/ToastDemoHeader";


describe("routeConfig", () => {
  it("enthält einen Eintrag für / mit DashboardHeader", () => {
    expect(routeConfig["/"]).toBeDefined();
    expect(routeConfig["/"].headerComponent).toBe(DashboardHeader);
  });
  it("enthält einen Eintrag für /times mit TimesHeader", () => {
    expect(routeConfig["/times"]).toBeDefined();
    expect(routeConfig["/times"].headerComponent).toBe(TimesHeader);
  });
  it("enthält einen Eintrag für /settings mit SettingsHeader", () => {
    expect(routeConfig["/settings"]).toBeDefined();
    expect(routeConfig["/settings"].headerComponent).toBe(SettingsHeader);
  });
  it("enthält verschachtelte Demos mit ModalDemoHeader und ToastDemoHeader", () => {
    expect(routeConfig["/demos"]).toBeDefined();
    expect(routeConfig["/demos"].children).toBeDefined();
    expect(routeConfig["/demos"].children!["/modal-demo"].headerComponent).toBe(ModalDemoHeader);
    expect(routeConfig["/demos"].children!["/toast-demo"].headerComponent).toBe(ToastDemoHeader);
  });
  it("hat überall title, pretitle und icon", () => {
    for (const entry of Object.values(routeConfig)) {
      expect(entry.title).toBeDefined();
      expect(entry.pretitle).toBeDefined();
      expect(entry.icon).toBeDefined();
    }
  });
}); 