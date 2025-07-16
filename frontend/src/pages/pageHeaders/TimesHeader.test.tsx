import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimesHeader from "./TimesHeader";

describe("TimesHeader", () => {
  it("rendert den Titel Zeiten", () => {
    render(<TimesHeader />);
    expect(screen.getByText("Zeiten")).toBeInTheDocument();
  });
}); 