import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { email: string; name: string } | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });
    const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Mock authentication
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email && _password) {
            const userData = { email, name: "Admin User" };
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user", JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
