import { describe, it, expect } from "vitest";
import { getHeaderComponentForRoute } from "./routeUtils";
import DashboardHeader from "../pages/pageHeaders/DashboardHeader";
import TimesHeader from "../pages/pageHeaders/TimesHeader";
import SettingsHeader from "../pages/pageHeaders/SettingsHeader";
import ModalDemoHeader from "../pages/pageHeaders/ModalDemoHeader";
import ToastDemoHeader from "../pages/pageHeaders/ToastDemoHeader";
import UserHeader from "../pages/pageHeaders/UserHeader";


describe("getHeaderComponentForRoute", () => {
  it("liefert DashboardHeader für /", () => {
    expect(getHeaderComponentForRoute("/")).toBe(DashboardHeader);
  });
  it("liefert TimesHeader für /times", () => {
    expect(getHeaderComponentForRoute("/times")).toBe(TimesHeader);
  });
  it("liefert SettingsHeader für /settings", () => {
    expect(getHeaderComponentForRoute("/settings")).toBe(SettingsHeader);
  });
  it("liefert ModalDemoHeader für verschachtelten Pfad /modal-demo", () => {
    expect(getHeaderComponentForRoute("/modal-demo")).toBe(ModalDemoHeader);
  });
  it("liefert ToastDemoHeader für verschachtelten Pfad /toast-demo", () => {
    expect(getHeaderComponentForRoute("/toast-demo")).toBe(ToastDemoHeader);
  });
  it("liefert UserHeader für verschachtelten Pfad /admin/users", () => {
    expect(getHeaderComponentForRoute("/admin/users")).toBe(UserHeader);
  });
  it("liefert undefined für unbekannten Pfad", () => {
    expect(getHeaderComponentForRoute("/unbekannt"))
      .toBeUndefined();
  });
}); 