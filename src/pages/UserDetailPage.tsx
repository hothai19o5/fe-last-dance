import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    Cpu,
    Battery,
    Clock,
    Heart,
    Activity,
    Footprints,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui";
import { userService, deviceService } from "@/services";
import { formatDateTime } from "@/lib/utils";
import type { User as UserType, Device, HealthMetric } from "@/types";

type TimeRange = "1h" | "today" | "7d";

export function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);
    const [device, setDevice] = useState<Device | null>(null);
    const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>("today");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const [userData, deviceData] = await Promise.all([
                    userService.getUserById(id),
                    deviceService.getDeviceByUserId(id),
                ]);
                setUser(userData || null);
                setDevice(deviceData || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchHealthMetrics = async () => {
            if (!id) return;

            try {
                const metrics = await userService.getUserHealthMetrics(id, timeRange);
                setHealthMetrics(metrics);
            } catch (error) {
                console.error("Error fetching health metrics:", error);
            }
        };

        fetchHealthMetrics();
    }, [id, timeRange]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">User not found</p>
                <Button onClick={() => navigate("/users")}>Back to Users</Button>
            </div>
        );
    }

    const getBatteryColor = (level: number) => {
        if (level <= 20) return "text-destructive";
        if (level <= 50) return "text-muted-foreground";
        return "text-foreground";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/users")}
                    className="rounded-xl"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">User ID: {user.id}</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Profile</p>
                                <p className="font-medium">
                                    {user.age}y • {user.gender}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user.height}cm • {user.weight}kg
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Cpu className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Device</p>
                                <p className="font-mono font-medium">{device?.id || "N/A"}</p>
                                <Badge
                                    variant={
                                        device?.connectionStatus === "Connected"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="mt-1"
                                >
                                    {device?.connectionStatus || "Unknown"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Battery className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Battery</p>
                                <p
                                    className={`text-2xl font-bold ${getBatteryColor(
                                        device?.batteryLevel || 0
                                    )}`}
                                >
                                    {device?.batteryLevel || 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Active</p>
                                <p className="text-sm font-medium">
                                    {formatDateTime(user.lastActiveTime)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Charts */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Health Metrics</CardTitle>
                        <Tabs
                            value={timeRange}
                            onValueChange={(v) => setTimeRange(v as TimeRange)}
                        >
                            <TabsList>
                                <TabsTrigger value="1h">1 Hour</TabsTrigger>
                                <TabsTrigger value="today">Today</TabsTrigger>
                                <TabsTrigger value="7d">7 Days</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Heart Rate Chart */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Heart Rate (BPM)</span>
                            </div>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={healthMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="timestamp"
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return timeRange === "1h"
                                                    ? date.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : date.toLocaleDateString([], {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                            }}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis
                                            domain={[40, 120]}
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                            }}
                                            labelFormatter={(value) =>
                                                formatDateTime(value as string)
                                            }
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="heartRate"
                                            stroke="#525252"
                                            strokeWidth={2}
                                            dot={false}
                                            name="Heart Rate"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* SpO2 Chart */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">SpO2 (%)</span>
                            </div>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={healthMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="timestamp"
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return timeRange === "1h"
                                                    ? date.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : date.toLocaleDateString([], {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                            }}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis
                                            domain={[85, 100]}
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                            }}
                                            labelFormatter={(value) =>
                                                formatDateTime(value as string)
                                            }
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="spO2"
                                            stroke="#737373"
                                            strokeWidth={2}
                                            dot={false}
                                            name="SpO2"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Steps Chart */}
                    <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                            <Footprints className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Steps</span>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={healthMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="timestamp"
                                        tick={{ fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return timeRange === "1h"
                                                ? date.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : date.toLocaleDateString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                });
                                        }}
                                        className="fill-muted-foreground"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        className="fill-muted-foreground"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "12px",
                                        }}
                                        labelFormatter={(value) => formatDateTime(value as string)}
                                    />
                                    <Bar
                                        dataKey="steps"
                                        fill="#404040"
                                        radius={[4, 4, 0, 0]}
                                        name="Steps"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
