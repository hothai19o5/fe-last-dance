import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="container mx-auto p-4 lg:p-6"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
