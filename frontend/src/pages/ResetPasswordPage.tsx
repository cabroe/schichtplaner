import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For demo purposes, accept any email
            setMessage("Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet.");
        } catch (error) {
            setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container container-tight py-4 d-flex flex-column align-items-center justify-content-center min-vh-100">
            <div className="text-center mb-4">
                <h1 className="text-white">
                    <i className="fas fa-calendar-alt" style={{ fontSize: "1.5rem", marginRight: "0.9rem" }}></i>
                    Schichtplaner
                </h1>
            </div>

            <div className="card" style={{ minWidth: "320px", maxWidth: "450px", width: "90vw" }}>
                <div className="card-body p-4 p-md-5">
                    <h2 className="card-title text-center mb-4">
                        Passwort zurücksetzen
                    </h2>
                    <p className="text-muted text-center mb-4">
                        Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
                    </p>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                E-Mail-Adresse
                            </label>
                            <input
                                autoComplete="email"
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="ihre.email@beispiel.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-success mt-3" role="alert">
                                {message}
                            </div>
                        )}

                        <div className="form-footer">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Wird gesendet...
                                    </>
                                ) : (
                                    "Link senden"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-decoration-none">
                            <i className="fas fa-arrow-left me-2"></i>
                            Zurück zur Anmeldung
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 