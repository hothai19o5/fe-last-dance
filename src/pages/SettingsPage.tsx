import { motion } from "framer-motion";
import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { useTheme, useAuth } from "@/context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Label,
} from "@/components/ui";

export function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and preferences
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">
                                {user?.name || "Admin User"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">
                                {user?.email || "admin@example.com"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">
                                Administrator
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize how the app looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={theme === "light" ? "default" : "outline"}
                                    className="flex flex-col gap-1 h-auto py-3"
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="h-5 w-5" />
                                    <span className="text-xs">Light</span>
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "outline"}
                                    className="flex flex-col gap-1 h-auto py-3"
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="h-5 w-5" />
                                    <span className="text-xs">Dark</span>
                                </Button>
                                <Button
                                    variant={theme === "system" ? "default" : "outline"}
                                    className="flex flex-col gap-1 h-auto py-3"
                                    onClick={() => setTheme("system")}
                                >
                                    <Monitor className="h-5 w-5" />
                                    <span className="text-xs">System</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>About this application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Application</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">
                                IoT Health Monitoring System
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Version</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">1.0.0</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Environment</Label>
                            <p className="rounded-xl bg-muted px-4 py-2.5 text-sm">
                                Production
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Architecture Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Architecture</CardTitle>
                        <CardDescription>Data flow overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-2 py-4">
                            <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">
                                IoT Device
                            </div>
                            <div className="h-6 w-px bg-border" />
                            <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">
                                Mobile App Gateway
                            </div>
                            <div className="h-6 w-px bg-border" />
                            <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">
                                Backend Server
                            </div>
                            <div className="h-6 w-px bg-border" />
                            <div className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                Web Admin Dashboard
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
