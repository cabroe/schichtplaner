import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader", () => {
  it("rendert den Willkommen-Text und den Titel", () => {
    render(<DashboardHeader />);
    expect(screen.getByText("Willkommen")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
}); 