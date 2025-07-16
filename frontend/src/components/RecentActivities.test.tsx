import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecentActivities from "./RecentActivities";

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => ({
    open: vi.fn(),
    close: vi.fn(),
    isOpen: () => false,
  }),
}));

describe("RecentActivities", () => {
  it("zeigt Button an", () => {
    render(<RecentActivities />);
    expect(screen.getByTitle("Letzte Tätigkeit neu starten")).toBeInTheDocument();
  });

  it("kann geklickt werden", () => {
    render(<RecentActivities />);
    fireEvent.click(screen.getByTitle("Letzte Tätigkeit neu starten"));
    // Keine Fehlermeldung = Test bestanden
  });
}); 