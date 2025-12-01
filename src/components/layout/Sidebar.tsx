import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    Cpu,
    Settings,
    Activity,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Devices", href: "/devices", icon: Cpu },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-full w-[280px] border-r bg-card transition-transform duration-200 ease-in-out",
                    "flex flex-col",
                    "lg:relative lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                            <Activity className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">HealthMonitor</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t p-4">
                    <div className="rounded-xl bg-muted p-4">
                        <p className="text-xs text-muted-foreground">
                            IoT Health Monitoring System
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">v1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
