import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SimpleTemplate from "../templates/SimpleTemplate";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, location.state?.from?.pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            } else {
                setError("Ungültige Anmeldedaten. Verwenden Sie admin:admin für den Test.");
            }
        } catch (error) {
            setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SimpleTemplate>
            <div className="container container-tight py-4 d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="text-center mb-4">
                    <h1 className="text-white">
                        <i className="fas fa-calendar-alt" style={{ fontSize: "1.5rem", marginRight: "0.9rem" }}></i>
                        Schichtplaner
                    </h1>
                </div>

                <div className="card" style={{ minWidth: "320px", maxWidth: "400px", width: "90vw" }}>
                    <div className="card-body p-4 p-md-5">
                        <h2 className="card-title text-center mb-4">
                            Anmelden
                        </h2>
                        <form onSubmit={handleSubmit} autoComplete="off" className="login-box-body security-login">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Benutzername
                                </label>
                                <div className="input-group input-group-flat">
                                    <input
                                        autoComplete="username"
                                        type="text"
                                        id="username"
                                        name="_username"
                                        className="form-control"
                                        placeholder="Benutzername"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        tabIndex={1}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Passwort
                                    <span className="form-label-description">
                                        <Link to="/reset-password" tabIndex={-1}>Passwort vergessen</Link>
                                    </span>
                                </label>
                                <div className="position-relative">
                                    <input
                                        autoComplete="new-password"
                                        id="password"
                                        name="_password"
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Passwort"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        tabIndex={2}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-link link-secondary position-absolute"
                                        style={{ right: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
                                        onClick={togglePasswordVisibility}
                                        title={showPassword ? "Passwort verstecken" : "Passwort anzeigen"}
                                        tabIndex={-1}
                                    >
                                        <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isLoading}
                                    tabIndex={3}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Anmelden...
                                        </>
                                    ) : (
                                        "Anmelden"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SimpleTemplate>
    );
};

export default LoginPage; 