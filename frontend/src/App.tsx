import {
  Route,
  Routes,
} from "react-router-dom";
import Times from "./pages/Times";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import ModalDemo from "./pages/ModalDemo";
import ToastDemo from "./pages/ToastDemo";
import MainTemplate from "./templates/MainTemplate";
import NotFound from "./pages/NotFound";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainTemplate><Dashboard /></MainTemplate>} />
      <Route path="/times" element={<MainTemplate><Times /></MainTemplate>} />
      <Route path="/settings" element={<MainTemplate><Settings /></MainTemplate>} />
      <Route path="/modal-demo" element={<MainTemplate><ModalDemo /></MainTemplate>} />
      <Route path="/toast-demo" element={<MainTemplate><ToastDemo /></MainTemplate>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
