import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate("/");
            } else {
                setError("Invalid username or password");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                            <Activity className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Welcome back</CardTitle>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to your admin account
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            IoT Health Monitoring System • Admin Dashboard
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
