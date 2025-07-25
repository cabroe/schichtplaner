import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import MainTemplate from "./templates/MainTemplate";
import NotFound from "./pages/NotFound";
import { ProtectedRoute, LogoutHandler } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import SimpleTemplate from "./templates/SimpleTemplate";
import { publicRoutes, protectedRoutes } from "./routes/routeDefinitions";
import "./App.css";

// Loading-Komponente
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Laden...</span>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Logout Route */}
          <Route path="/logout" element={<LogoutHandler />} />
          
          {/* Public Routes */}
          {publicRoutes.map(({ path, component: Component, template }) => (
            <Route
              key={path}
              path={path}
              element={
                template === 'simple' ? (
                  <SimpleTemplate>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Component />
                    </Suspense>
                  </SimpleTemplate>
                ) : (
                  <MainTemplate>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Component />
                    </Suspense>
                  </MainTemplate>
                )
              }
            />
          ))}
          
          {/* Protected Routes */}
          {protectedRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <MainTemplate>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Component />
                    </Suspense>
                  </MainTemplate>
                </ProtectedRoute>
              }
            />
          ))}
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default AppRoutes;
