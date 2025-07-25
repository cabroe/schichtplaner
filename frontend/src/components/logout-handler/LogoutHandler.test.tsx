import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LogoutHandler from "./LogoutHandler";

// Mock react-router-dom
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock AuthContext
const mockLogout = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        logout: mockLogout,
    }),
}));

const renderLogoutHandler = () => {
    return render(
        <BrowserRouter>
            <LogoutHandler />
        </BrowserRouter>
    );
};

describe("LogoutHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mockLogout to return a resolved promise by default
        mockLogout.mockResolvedValue(undefined);
    });

    describe("Rendering", () => {
        it("should render logout loading screen", () => {
            renderLogoutHandler();

            expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            expect(screen.getByRole("status")).toBeInTheDocument();
            expect(screen.getByText("Abmelden...")).toBeInTheDocument();
        });

        it("should render spinner with correct classes", () => {
            renderLogoutHandler();

            const spinner = screen.getByRole("status");
            expect(spinner).toHaveClass("spinner-border");
        });

        it("should render visually hidden text for screen readers", () => {
            renderLogoutHandler();

            const hiddenText = screen.getByText("Abmelden...");
            expect(hiddenText).toHaveClass("visually-hidden");
        });

        it("should have proper layout classes", () => {
            renderLogoutHandler();

            const container = screen.getByText("Sie werden abgemeldet...").closest("div");
            expect(container?.parentElement).toHaveClass("d-flex", "justify-content-center", "align-items-center", "min-vh-100");
        });

        it("should have proper text styling", () => {
            renderLogoutHandler();

            const text = screen.getByText("Sie werden abgemeldet...");
            expect(text).toHaveClass("mt-3");
        });
    });

    describe("Logout Functionality", () => {
        it("should call logout function on mount", async () => {
            renderLogoutHandler();

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalledTimes(1);
            }, { timeout: 2000 });
        });

        it("should navigate to login page after logout", async () => {
            renderLogoutHandler();

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
            }, { timeout: 2000 });
        });

        it("should call logout before navigation", async () => {
            renderLogoutHandler();

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
            }, { timeout: 2000 });
        });
    });

    describe("Accessibility", () => {
        it("should have proper ARIA role for spinner", () => {
            renderLogoutHandler();

            const spinner = screen.getByRole("status");
            expect(spinner).toBeInTheDocument();
        });

        it("should have screen reader accessible text", () => {
            renderLogoutHandler();

            const hiddenText = screen.getByText("Abmelden...");
            expect(hiddenText).toBeInTheDocument();
            expect(hiddenText).toHaveClass("visually-hidden");
        });

        it("should have proper semantic structure", () => {
            renderLogoutHandler();

            // Check that the structure is logical
            const container = screen.getByText("Sie werden abgemeldet...").closest("div");
            expect(container).toBeInTheDocument();
        });
    });

    describe("Layout and Styling", () => {
        it("should center content vertically and horizontally", () => {
            renderLogoutHandler();

            const mainContainer = screen.getByText("Sie werden abgemeldet...").closest("div")?.parentElement;
            expect(mainContainer).toHaveClass("d-flex", "justify-content-center", "align-items-center", "min-vh-100");
        });

        it("should have full viewport height", () => {
            renderLogoutHandler();

            const mainContainer = screen.getByText("Sie werden abgemeldet...").closest("div")?.parentElement;
            expect(mainContainer).toHaveClass("min-vh-100");
        });

        it("should have centered text content", () => {
            renderLogoutHandler();

            const textContainer = screen.getByText("Sie werden abgemeldet...").closest("div");
            expect(textContainer).toHaveClass("text-center");
        });
    });

    describe("Loading State", () => {
        it("should show loading spinner", () => {
            renderLogoutHandler();

            const spinner = screen.getByRole("status");
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveClass("spinner-border");
        });

        it("should show loading message", () => {
            renderLogoutHandler();

            expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
        });

        it("should have proper spinner structure", () => {
            renderLogoutHandler();

            const spinner = screen.getByRole("status");
            const hiddenText = spinner.querySelector(".visually-hidden");
            expect(hiddenText).toHaveTextContent("Abmelden...");
        });
    });

    describe("Error Handling", () => {
        it("should handle logout function errors gracefully", async () => {
            // Mock logout to throw an error
            mockLogout.mockRejectedValue(new Error("Logout failed"));

            // Suppress console error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            renderLogoutHandler();

            // Should still render the loading screen even if logout fails
            expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            expect(screen.getByRole("status")).toBeInTheDocument();

            // Wait a bit to ensure the error is handled
            await waitFor(() => {
                expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            }, { timeout: 2000 });

            // Reset mocks for other tests
            mockLogout.mockResolvedValue(undefined);
            consoleSpy.mockRestore();
        });

        it("should handle navigation errors gracefully", async () => {
            // Mock navigate to throw an error
            mockNavigate.mockImplementation(() => {
                throw new Error("Navigation failed");
            });

            // Suppress console error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            renderLogoutHandler();

            // Should still render the loading screen even if navigation fails
            expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            expect(screen.getByRole("status")).toBeInTheDocument();

            // Wait a bit to ensure the error is handled
            await waitFor(() => {
                expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            }, { timeout: 2000 });

            // Reset mocks for other tests
            mockNavigate.mockImplementation(() => {});
            consoleSpy.mockRestore();
        });
    });

    describe("Component Lifecycle", () => {
        it("should execute logout and navigation on mount", async () => {
            renderLogoutHandler();

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalledTimes(1);
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            }, { timeout: 2000 });
        });

        it("should not re-execute logout on re-render", async () => {
            const { rerender } = renderLogoutHandler();

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalledTimes(1);
            }, { timeout: 2000 });

            // Re-render the component
            rerender(
                <BrowserRouter>
                    <LogoutHandler />
                </BrowserRouter>
            );

            // Should not call logout again
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });

    describe("User Experience", () => {
        it("should provide immediate feedback to user", () => {
            renderLogoutHandler();

            // User should see loading state immediately
            expect(screen.getByText("Sie werden abgemeldet...")).toBeInTheDocument();
            expect(screen.getByRole("status")).toBeInTheDocument();
        });

        it("should have clear visual indication of logout process", () => {
            renderLogoutHandler();

            const spinner = screen.getByRole("status");
            const message = screen.getByText("Sie werden abgemeldet...");

            expect(spinner).toBeInTheDocument();
            expect(message).toBeInTheDocument();
        });

        it("should be accessible to screen readers", () => {
            renderLogoutHandler();

            const hiddenText = screen.getByText("Abmelden...");
            expect(hiddenText).toHaveClass("visually-hidden");
            expect(hiddenText).toBeInTheDocument();
        });
    });
}); 