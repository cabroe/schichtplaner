import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Mock für AuthContext
vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../contexts/AuthContext";

describe("ProtectedRoute", () => {
  const mockUseAuth = useAuth as vi.MockedFunction<typeof useAuth>;

  it("zeigt Loading-Spinner während der Auth-Prüfung", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

            render(
      <MemoryRouter>
                                <ProtectedRoute>
          <div>Geschützter Inhalt</div>
                                </ProtectedRoute>
                </MemoryRouter>
            );

    expect(screen.getByText("Authentifizierung wird geprüft...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Geschützter Inhalt")).not.toBeInTheDocument();
        });

  it("leitet zur Login-Seite weiter wenn nicht authentifiziert", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                                <ProtectedRoute>
          <div>Geschützter Inhalt</div>
                                </ProtectedRoute>
                </MemoryRouter>
            );

    // Warten bis die Weiterleitung stattfindet
    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });

  it("zeigt geschützten Inhalt wenn authentifiziert", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", username: "admin", role: "admin" },
      login: vi.fn(),
      logout: vi.fn(),
    });

            render(
      <MemoryRouter>
                                <ProtectedRoute>
          <div>Geschützter Inhalt</div>
                                </ProtectedRoute>
                </MemoryRouter>
            );

    expect(screen.getByText("Geschützter Inhalt")).toBeInTheDocument();
    expect(screen.queryByText("Authentifizierung wird geprüft...")).not.toBeInTheDocument();
        });

  it("speichert die ursprüngliche URL für die Weiterleitung", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

            render(
      <MemoryRouter initialEntries={["/dashboard"]}>
                                    <ProtectedRoute>
          <div>Geschützter Inhalt</div>
                                    </ProtectedRoute>
                </MemoryRouter>
            );

    // Warten bis die Weiterleitung stattfindet
    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
        });
    });
}); 