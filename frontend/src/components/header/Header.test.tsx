import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

vi.mock("./UserDropdown", () => ({ default: () => <div data-testid="userdropdown" /> }));
vi.mock("./TicktacActions", () => ({ default: () => <div data-testid="ticktacactions" /> }));
vi.mock("./RecentActivities", () => ({ default: () => <div data-testid="recentactivities" /> }));

describe("Header", () => {
  it("zeigt den Titel und die Subkomponenten an", () => {
    render(<Header title="Testtitel" />);
    expect(screen.getByRole("heading", { name: "Testtitel" })).toBeInTheDocument();
    expect(screen.getByTestId("userdropdown")).toBeInTheDocument();
    expect(screen.getByTestId("ticktacactions")).toBeInTheDocument();
    expect(screen.getByTestId("recentactivities")).toBeInTheDocument();
  });
}); 