import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("zeigt das Dashboard auf /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("heading", { name: /Dashboard/i }).length).toBeGreaterThan(0);
  });

  it("zeigt die Zeiten-Seite auf /times", () => {
    render(
      <MemoryRouter initialEntries={["/times"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("heading", { name: /Zeiten/i }).length).toBeGreaterThan(0);
  });

  it("zeigt die Settings-Seite auf /settings", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("heading", { name: /Einstellungen/i }).length).toBeGreaterThan(0);
  });

  it("zeigt die 404-Seite bei unbekannter Route", () => {
    render(
      <MemoryRouter initialEntries={["/unbekannt"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });
}); 