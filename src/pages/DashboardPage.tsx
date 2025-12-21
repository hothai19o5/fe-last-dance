import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    AlertTriangle,
    Wifi,
    Server,
    Database,
    Clock,
    Activity,
    Cpu,
    HardDrive,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { healthService } from "@/services";
import { formatDateTime } from "@/lib/utils";
import type { DashboardStats, SystemHealth, DatabaseStatus, DeviceStats, ApiStats, ServiceStatus } from "@/types";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.3 },
    }),
};

const COLORS = ["#404040", "#737373", "#a3a3a3", "#d4d4d4"];

export function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
    const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
    const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
    const [apiStats, setApiStats] = useState<ApiStats | null>(null);
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Fetch all dashboard data with a single API call
                const data = await healthService.getAllDashboardData();

                // Only update state if component is still mounted
                if (isMounted) {
                    setStats(data.stats);
                    setSystemHealth(data.systemHealth);
                    setDbStatus(data.databaseStatus);
                    setDeviceStats(data.deviceStats);
                    setApiStats(data.apiStats);
                    setServices(data.services);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching dashboard data:", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            description: "Registered users",
        },
        {
            title: "Active Today",
            value: stats?.activeUsersToday || 0,
            icon: UserCheck,
            description: "Users active today",
        },
        {
            title: "Alerts (24h)",
            value: stats?.alertsLast24h || 0,
            icon: AlertTriangle,
            description: "Last 24 hours",
        },
        {
            title: "Devices Online",
            value: stats?.devicesOnline || 0,
            icon: Wifi,
            description: "Currently connected",
        },
    ];

    const devicePieData = deviceStats ? [
        { name: "Active", value: deviceStats.active },
        { name: "Inactive", value: deviceStats.inactive },
        { name: "Low Battery", value: deviceStats.lowBattery },
    ] : [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Running":
                return <CheckCircle className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
            case "Stopped":
                return <XCircle className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />;
            case "Warning":
                return <AlertCircle className="h-4 w-4 text-neutral-500" />;
            default:
                return null;
        }
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "Running":
            case "Connected":
                return "default";
            case "Warning":
            case "Degraded":
                return "secondary";
            case "Stopped":
            case "Disconnected":
                return "destructive";
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    System overview and backend health monitoring
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <Card className="transition-all duration-200 hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{card.title}</p>
                                        <p className="mt-1 text-3xl font-bold">
                                            {card.value.toLocaleString()}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {card.description}
                                        </p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                        <card.icon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* System Health Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Server Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Server className="h-5 w-5" />
                                Server Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Uptime</span>
                                </div>
                                <span className="font-mono font-medium">{systemHealth?.uptime}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                        CPU Usage
                                    </span>
                                    <span className="font-medium">{systemHealth?.cpuUsage}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-neutral-600 dark:bg-neutral-400 transition-all"
                                        style={{ width: `${systemHealth?.cpuUsage}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                        Memory
                                    </span>
                                    <span className="font-medium">{systemHealth?.memoryUsed} / {systemHealth?.memoryTotal}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-neutral-600 dark:bg-neutral-400 transition-all"
                                        style={{ width: `${systemHealth?.memoryUsage}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                                        Disk
                                    </span>
                                    <span className="font-medium">{systemHealth?.diskUsed} / {systemHealth?.diskTotal}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-neutral-600 dark:bg-neutral-400 transition-all"
                                        style={{ width: `${systemHealth?.diskUsage}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Database Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Database className="h-5 w-5" />
                                Database Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Status</span>
                                <Badge variant={getStatusBadgeVariant(dbStatus?.status || "")}>
                                    {dbStatus?.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Response Time</span>
                                <span className="font-mono font-medium">{dbStatus?.responseTime} ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Connections</span>
                                <span className="font-medium">{dbStatus?.connections} / {dbStatus?.maxConnections}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Connection Pool</span>
                                    <span className="font-medium">{Math.round((dbStatus?.connections || 0) / (dbStatus?.maxConnections || 1) * 100)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-neutral-600 dark:bg-neutral-400 transition-all"
                                        style={{ width: `${(dbStatus?.connections || 0) / (dbStatus?.maxConnections || 1) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Database Size</span>
                                <span className="font-medium">{dbStatus?.size}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Last Backup</span>
                                <span className="text-sm">{dbStatus?.lastBackup ? formatDateTime(dbStatus.lastBackup) : "N/A"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* API Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Zap className="h-5 w-5" />
                                API Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Requests/min</span>
                                <span className="font-mono text-2xl font-bold">{apiStats?.requestsPerMinute.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                                <span className="font-mono font-medium">{apiStats?.avgResponseTime} ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Success Rate</span>
                                <span className="font-medium text-neutral-600 dark:text-neutral-400">{apiStats?.successRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Error Rate</span>
                                <span className="font-medium">{apiStats?.errorRate}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Device Stats & Services Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Device Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Wifi className="h-5 w-5" />
                                Device Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center">
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={devicePieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {devicePieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--card)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: "12px",
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold">{deviceStats?.total.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total Devices</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{deviceStats?.active.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Active</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{deviceStats?.inactive.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Inactive</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Services Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Server className="h-5 w-5" />
                                Services Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {services.map((service) => (
                                    <div
                                        key={service.name}
                                        className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(service.status)}
                                            <div>
                                                <p className="font-medium">{service.name}</p>
                                                <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusBadgeVariant(service.status)}>
                                            {service.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
