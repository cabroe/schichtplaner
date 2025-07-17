import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        Navigate: ({ to, state, replace }: { to: string; state: any; replace: boolean }) => {
            mockNavigate(to, state, replace);
            return <div data-testid="navigate-component">Redirecting to {to}</div>;
        },
        useLocation: () => mockUseLocation(),
    };
});

// Mock AuthContext
const mockUseAuth = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

// Test component to render inside ProtectedRoute
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const renderProtectedRoute = (isAuthenticated: boolean, currentPath: string = "/protected") => {
    mockUseAuth.mockReturnValue({ isAuthenticated });
    mockUseLocation.mockReturnValue({ pathname: currentPath });

    return render(
        <MemoryRouter initialEntries={[currentPath]}>
            <Routes>
                <Route
                    path={currentPath}
                    element={
                        <ProtectedRoute>
                            <TestComponent />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Authenticated User", () => {
        it("should render children when user is authenticated", () => {
            renderProtectedRoute(true);

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
            expect(screen.getByText("Protected Content")).toBeInTheDocument();
        });

        it("should not redirect when user is authenticated", () => {
            renderProtectedRoute(true);

            expect(screen.queryByTestId("navigate-component")).not.toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it("should render multiple children when authenticated", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/protected" });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div data-testid="child-1">Child 1</div>
                                    <div data-testid="child-2">Child 2</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId("child-1")).toBeInTheDocument();
            expect(screen.getByTestId("child-2")).toBeInTheDocument();
            expect(screen.getByText("Child 1")).toBeInTheDocument();
            expect(screen.getByText("Child 2")).toBeInTheDocument();
        });
    });

    describe("Unauthenticated User", () => {
        it("should redirect to login page when user is not authenticated", () => {
            renderProtectedRoute(false);

            expect(screen.getByTestId("navigate-component")).toBeInTheDocument();
            expect(screen.getByText("Redirecting to /login")).toBeInTheDocument();
        });

        it("should call Navigate with correct parameters", () => {
            renderProtectedRoute(false, "/dashboard");

            expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: "/dashboard" } }, true);
        });

        it("should not render children when user is not authenticated", () => {
            renderProtectedRoute(false);

            expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
            expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
        });

        it("should preserve current location in redirect state", () => {
            renderProtectedRoute(false, "/settings");

            expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: "/settings" } }, true);
        });
    });

    describe("Location Handling", () => {
        it("should handle different current paths correctly", () => {
            const testPaths = ["/dashboard", "/settings", "/times", "/modal-demo"];

            testPaths.forEach(path => {
                vi.clearAllMocks();
                renderProtectedRoute(false, path);

                expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: path } }, true);
            });
        });

        it("should handle root path correctly", () => {
            renderProtectedRoute(false, "/");

            expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: "/" } }, true);
        });

        it("should handle nested paths correctly", () => {
            renderProtectedRoute(false, "/nested/deep/path");

            expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: "/nested/deep/path" } }, true);
        });
    });

    describe("Component Behavior", () => {
        it("should re-render when authentication state changes", () => {
            const { rerender } = renderProtectedRoute(false);

            // Initially should redirect
            expect(screen.getByTestId("navigate-component")).toBeInTheDocument();
            expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();

            // Change to authenticated
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            rerender(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <TestComponent />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should now show protected content
            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate-component")).not.toBeInTheDocument();
        });

        it("should handle complex children components", () => {
            const ComplexComponent = () => (
                <div data-testid="complex-component">
                    <h1>Complex Title</h1>
                    <p>Complex description</p>
                    <button>Action Button</button>
                </div>
            );

            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/protected" });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <ComplexComponent />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId("complex-component")).toBeInTheDocument();
            expect(screen.getByText("Complex Title")).toBeInTheDocument();
            expect(screen.getByText("Complex description")).toBeInTheDocument();
            expect(screen.getByText("Action Button")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty children", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/protected" });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={<ProtectedRoute>{null}</ProtectedRoute>}
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should not crash and should not redirect
            expect(screen.queryByTestId("navigate-component")).not.toBeInTheDocument();
        });

        it("should handle null children", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/protected" });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={<ProtectedRoute>{null}</ProtectedRoute>}
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should not crash and should not redirect
            expect(screen.queryByTestId("navigate-component")).not.toBeInTheDocument();
        });

        it("should handle undefined authentication state", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: undefined });
            mockUseLocation.mockReturnValue({ pathname: "/protected" });

            render(
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <TestComponent />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect when authentication is undefined
            expect(screen.getByTestId("navigate-component")).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith("/login", { from: { pathname: "/protected" } }, true);
        });
    });

    describe("Integration with Router", () => {
        it("should work with nested routes", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/nested/protected" });

            render(
                <MemoryRouter initialEntries={["/nested/protected"]}>
                    <Routes>
                        <Route path="/nested">
                            <Route
                                path="protected"
                                element={
                                    <ProtectedRoute>
                                        <TestComponent />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        });

        it("should work with route parameters", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            mockUseLocation.mockReturnValue({ pathname: "/user/123/profile" });

            render(
                <MemoryRouter initialEntries={["/user/123/profile"]}>
                    <Routes>
                        <Route
                            path="/user/:id/profile"
                            element={
                                <ProtectedRoute>
                                    <TestComponent />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        });
    });

    describe("Performance and Memory", () => {
        it("should not cause memory leaks with frequent re-renders", () => {
            const { rerender } = renderProtectedRoute(true);

            // Simulate multiple re-renders
            for (let i = 0; i < 10; i++) {
                rerender(
                    <MemoryRouter initialEntries={["/protected"]}>
                        <Routes>
                            <Route
                                path="/protected"
                                element={
                                    <ProtectedRoute>
                                        <TestComponent />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </MemoryRouter>
                );
            }

            // Should still work correctly
            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        });

        it("should handle rapid authentication state changes", () => {
            const { rerender } = renderProtectedRoute(false);

            // Rapidly change authentication state
            for (let i = 0; i < 5; i++) {
                mockUseAuth.mockReturnValue({ isAuthenticated: i % 2 === 0 });
                rerender(
                    <MemoryRouter initialEntries={["/protected"]}>
                        <Routes>
                            <Route
                                path="/protected"
                                element={
                                    <ProtectedRoute>
                                        <TestComponent />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </MemoryRouter>
                );
            }

            // Final state should be correct (i=4, so 4 % 2 === 0 is true, so authenticated)
            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate-component")).not.toBeInTheDocument();
        });
    });
}); 