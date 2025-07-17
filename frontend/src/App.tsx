import {
  Route,
  Routes,
} from "react-router-dom";
import Times from "./pages/Times";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import ModalDemo from "./pages/ModalDemo";
import ToastDemo from "./pages/ToastDemo";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainTemplate from "./templates/MainTemplate";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutHandler from "./components/LogoutHandler";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import SimpleTemplate from "./templates/SimpleTemplate";

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<SimpleTemplate><LoginPage /></SimpleTemplate>} />
        <Route path="/reset-password" element={<SimpleTemplate><ResetPasswordPage /></SimpleTemplate>} />
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainTemplate><Dashboard /></MainTemplate>
          </ProtectedRoute>
        } />
        <Route path="/times" element={
          <ProtectedRoute>
            <MainTemplate><Times /></MainTemplate>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainTemplate><Settings /></MainTemplate>
          </ProtectedRoute>
        } />
        <Route path="/modal-demo" element={
          <ProtectedRoute>
            <MainTemplate><ModalDemo /></MainTemplate>
          </ProtectedRoute>
        } />
        <Route path="/toast-demo" element={
          <ProtectedRoute>
            <MainTemplate><ToastDemo /></MainTemplate>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;
