import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

interface User {
    id: string;
    username: string;
    role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
            }
        }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        // Test login with admin:admin
        if (username === "admin" && password === "admin") {
            const userData: User = {
                id: "1",
                username: "admin",
                role: "admin"
            };

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setUser(userData);
            setIsAuthenticated(true);

            // Store in localStorage
            localStorage.setItem("authToken", "test-token-" + Date.now());
            localStorage.setItem("userData", JSON.stringify(userData));

            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
    };

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 