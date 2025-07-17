import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

// Hilfskomponente für Tests
const TestComponent = () => {
    const { isAuthenticated, isLoading, user, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="auth-status">{isAuthenticated ? "auth" : "noauth"}</span>
            <span data-testid="loading-status">{isLoading ? "loading" : "loaded"}</span>
            <span data-testid="user">{user ? user.username : "no-user"}</span>
            <button onClick={() => login("admin", "admin")} data-testid="login-btn">Login</button>
            <button onClick={logout} data-testid="logout-btn">Logout</button>
        </div>
    );
};

const renderWithProvider = (ui: React.ReactNode) => {
    return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("startet im Loading-Zustand", () => {
        renderWithProvider(<TestComponent />);
        expect(screen.getByTestId("loading-status").textContent).toBe("loading");
    });

    it("beendet Loading-Zustand nach Auth-Prüfung", async () => {
        renderWithProvider(<TestComponent />);
        
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
        }, { timeout: 2000 });
    });

    it("startet nicht authentifiziert und ohne User nach Loading", async () => {
        renderWithProvider(<TestComponent />);
        
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
        });
        
        expect(screen.getByTestId("auth-status").textContent).toBe("noauth");
        expect(screen.getByTestId("user").textContent).toBe("no-user");
    });

    it("kann sich erfolgreich einloggen (admin:admin)", async () => {
        renderWithProvider(<TestComponent />);
        
        // Warten bis Loading beendet ist
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
        });
        
        // Klick auslösen und auf die asynchrone login-Funktion warten
        await act(async () => {
            screen.getByTestId("login-btn").click();
        });
        
        // Warten, bis der State nach dem 500ms Delay aktualisiert ist
        await waitFor(() => {
            expect(screen.getByTestId("auth-status").textContent?.trim()).toBe("auth");
            expect(screen.getByTestId("user").textContent?.trim()).toBe("admin");
        }, { timeout: 2000 });
        
        // localStorage sollte gesetzt sein
        expect(localStorage.getItem("authToken")).toMatch(/^test-token-/);
        expect(JSON.parse(localStorage.getItem("userData")!).username).toBe("admin");
    });

    it("verweigert Login bei falschen Credentials", async () => {
        const WrongLogin = () => {
            const { login, isAuthenticated, isLoading } = useAuth();
            return (
                <button data-testid="login-fail" onClick={() => login("foo", "bar")}>
                    {isLoading ? "loading" : isAuthenticated ? "auth" : "noauth"}
                </button>
            );
        };
        renderWithProvider(<WrongLogin />);
        
        // Warten bis Loading beendet ist
        await waitFor(() => {
            expect(screen.getByTestId("login-fail").textContent).toBe("noauth");
        });
        
        // Klick auslösen und auf die asynchrone login-Funktion warten
        await act(async () => {
            screen.getByTestId("login-fail").click();
        });
        
        // Warten, bis der State aktualisiert ist (sollte "noauth" bleiben)
        await waitFor(() => {
            expect(screen.getByTestId("login-fail").textContent).toBe("noauth");
        }, { timeout: 2000 });
        
        expect(localStorage.getItem("authToken")).toBeNull();
    });

    it("kann sich ausloggen und löscht localStorage", async () => {
        renderWithProvider(<TestComponent />);
        
        // Warten bis Loading beendet ist
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
        });
        
        // Erst einloggen und auf die asynchrone Funktion warten
        await act(async () => {
            screen.getByTestId("login-btn").click();
        });
        
        // Warten, bis der Login abgeschlossen ist
        await waitFor(() => {
            expect(screen.getByTestId("auth-status").textContent).toBe("auth");
        }, { timeout: 2000 });
        
        // Dann ausloggen
        act(() => {
            screen.getByTestId("logout-btn").click();
        });
        
        expect(screen.getByTestId("auth-status").textContent).toBe("noauth");
        expect(screen.getByTestId("user").textContent).toBe("no-user");
        expect(localStorage.getItem("authToken")).toBeNull();
        expect(localStorage.getItem("userData")).toBeNull();
    });

    it("liest Session aus localStorage beim Mount", async () => {
        localStorage.setItem("authToken", "test-token-123");
        localStorage.setItem("userData", JSON.stringify({ id: "1", username: "admin", role: "admin" }));
        renderWithProvider(<TestComponent />);
        
        // Warten bis Loading beendet ist und Auth-Status geprüft wurde
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
            expect(screen.getByTestId("auth-status").textContent).toBe("auth");
            expect(screen.getByTestId("user").textContent).toBe("admin");
        }, { timeout: 2000 });
    });

    it("ignoriert fehlerhaftes userData im localStorage", async () => {
        localStorage.setItem("authToken", "test-token-123");
        localStorage.setItem("userData", "not-a-json");
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        renderWithProvider(<TestComponent />);
        
        await waitFor(() => {
            expect(screen.getByTestId("loading-status").textContent).toBe("loaded");
        expect(screen.getByTestId("auth-status").textContent).toBe("noauth");
        expect(screen.getByTestId("user").textContent).toBe("no-user");
        });
        
        expect(localStorage.getItem("authToken")).toBeNull();
        expect(localStorage.getItem("userData")).toBeNull();
        errorSpy.mockRestore();
    });

    it("wirft Fehler, wenn useAuth außerhalb des Providers verwendet wird", () => {
        const OrigError = console.error;
        console.error = () => { }; // Suppress React error boundary logs
        const Broken = () => {
            useAuth();
            return null;
        };
        expect(() => render(<Broken />)).toThrow("useAuth must be used within an AuthProvider");
        console.error = OrigError;
    });
}); 