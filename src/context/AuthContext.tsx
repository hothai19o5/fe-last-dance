import { createContext, useContext, useState, type ReactNode } from "react";
import { authService } from "@/services";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("token");
    });
    const [user, setUser] = useState<{ username: string } | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await authService.login({ username, password });
            if (response.token) {
                authService.setToken(response.token);
                const userData = { username };
                setIsAuthenticated(true);
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        authService.logout();
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
