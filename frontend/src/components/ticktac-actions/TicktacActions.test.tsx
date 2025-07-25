import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TicktacActions from "./TicktacActions";

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => ({
    close: vi.fn(),
    isOpen: () => false,
  }),
}));

describe("TicktacActions", () => {
  it("zeigt Start-Button an", () => {
    render(<TicktacActions />);
    expect(screen.getByTitle("Zeiterfassung starten")).toBeInTheDocument();
  });

  it("kann Start-Button klicken", () => {
    render(<TicktacActions />);
    fireEvent.click(screen.getByTitle("Zeiterfassung starten"));
  });
}); 