import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserDropdown from "./UserDropdown";

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => ({
    open: vi.fn(),
    close: vi.fn(),
    isOpen: () => false,
  }),
}));

describe("UserDropdown", () => {
  it("zeigt Avatar und Menüeinträge an", () => {
    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>
    );
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("Mein Profil")).toBeInTheDocument();
    expect(screen.getByText("Abmelden")).toBeInTheDocument();
  });
}); 