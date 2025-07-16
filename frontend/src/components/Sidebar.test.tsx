import { describe, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => ({
    open: vi.fn(),
    close: vi.fn(),
    isOpen: () => false,
  }),
}));

describe("Sidebar", () => {
  it("rendert ohne Fehler", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    // Optional: expect(screen.getByText("Schichtplaner")).toBeInTheDocument();
  });
}); 