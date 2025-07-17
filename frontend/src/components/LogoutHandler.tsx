import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LogoutHandler: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/login", { replace: true });
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