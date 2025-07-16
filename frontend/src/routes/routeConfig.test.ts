import { describe, it, expect } from "vitest";
import { pageTitles } from "./routeConfig";
import DashboardHeader from "../pages/pageHeaders/DashboardHeader";
import TimesHeader from "../pages/pageHeaders/TimesHeader";
import SettingsHeader from "../pages/pageHeaders/SettingsHeader";
import ModalDemoHeader from "../pages/pageHeaders/ModalDemoHeader";
import ToastDemoHeader from "../pages/pageHeaders/ToastDemoHeader";


describe("pageTitles", () => {
  it("enthält einen Eintrag für / mit DashboardHeader", () => {
    expect(pageTitles["/"]).toBeDefined();
    expect(pageTitles["/"].headerComponent).toBe(DashboardHeader);
  });
  it("enthält einen Eintrag für /times mit TimesHeader", () => {
    expect(pageTitles["/times"]).toBeDefined();
    expect(pageTitles["/times"].headerComponent).toBe(TimesHeader);
  });
  it("enthält einen Eintrag für /settings mit SettingsHeader", () => {
    expect(pageTitles["/settings"]).toBeDefined();
    expect(pageTitles["/settings"].headerComponent).toBe(SettingsHeader);
  });
  it("enthält verschachtelte Demos mit ModalDemoHeader und ToastDemoHeader", () => {
    expect(pageTitles["/demos"]).toBeDefined();
    expect(pageTitles["/demos"].children).toBeDefined();
    expect(pageTitles["/demos"].children!["/modal-demo"].headerComponent).toBe(ModalDemoHeader);
    expect(pageTitles["/demos"].children!["/toast-demo"].headerComponent).toBe(ToastDemoHeader);
  });
  it("hat überall title, pretitle und icon", () => {
    for (const entry of Object.values(pageTitles)) {
      expect(entry.title).toBeDefined();
      expect(entry.pretitle).toBeDefined();
      expect(entry.icon).toBeDefined();
    }
  });
}); 