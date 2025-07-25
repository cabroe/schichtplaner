import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LogoutHandler: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
            } catch (error) {
                // Silently handle logout errors - user will still be redirected
                console.error("Logout error:", error);
            }
            
            try {
                // Always navigate to login page, even if logout fails
                navigate("/login", { replace: true });
            } catch (navigationError) {
                // Silently handle navigation errors
                console.error("Navigation error:", navigationError);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Abmelden...</span>
                </div>
                <p className="mt-3">Sie werden abgemeldet...</p>
            </div>
        </div>
    );
};

export default LogoutHandler; 