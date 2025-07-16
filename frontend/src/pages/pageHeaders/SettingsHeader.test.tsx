import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsHeader from "./SettingsHeader";

describe("SettingsHeader", () => {
  it("rendert den Titel Einstellungen", () => {
    render(
      <MemoryRouter>
        <SettingsHeader />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Einstellungen" })).toBeInTheDocument();
  });
}); 