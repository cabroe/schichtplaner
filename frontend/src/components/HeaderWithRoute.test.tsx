import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeaderWithRoute from "./HeaderWithRoute";

// Header-Komponente mocken, damit wir den Titel prüfen können
vi.mock("./Header", () => ({ default: ({ title }: any) => <div data-testid="header-title">{title}</div> }));

// useLocation mocken
vi.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/settings" }),
}));

describe("HeaderWithRoute", () => {
  it("zeigt den Titel der aktuellen Route an", () => {
    render(<HeaderWithRoute />);
    expect(screen.getByTestId("header-title")).toHaveTextContent("Einstellungen");
  });
}); 