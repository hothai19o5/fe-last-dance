import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    Cpu,
    Heart,
    Activity,
    Footprints,
    Mail,
    Scale,
    Droplet,
    Moon,
    Flame,
    AlertTriangle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
} from "@/components/ui";
import { userService } from "@/services";
import type { User as UserType, Device } from "@/types";
import type { UserOverview } from "@/services/userService";

export function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [overview, setOverview] = useState<UserOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const userId = parseInt(id, 10);
                const [userData, userDevices, userOverview] = await Promise.all([
                    userService.getUserById(userId),
                    userService.getUserDevices(userId),
                    userService.getUserOverview(userId),
                ]);
                setUser(userData || null);
                setDevices(userDevices || []);
                setOverview(userOverview || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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

    const activeDevice = devices.find(d => d.isActive) || devices[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
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
                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                    <p className="text-muted-foreground">@{user.username} • ID: {user.id}</p>
                </div>
                <Badge variant={user.enabled ? "default" : "secondary"} className="ml-auto">
                    {user.enabled ? "Enabled" : "Disabled"}
                </Badge>
            </div>

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
                                    {user.gender || "Not specified"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    DOB: {user.dob || "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Mail className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium text-sm break-all">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Scale className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Body Metrics</p>
                                <p className="font-medium">
                                    {user.heightM ? `${user.heightM}m` : "N/A"} • {user.weightKg ? `${user.weightKg}kg` : "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    BMI: {user.bmi?.toFixed(1) || "N/A"}
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
                                <p className="font-mono font-medium text-sm">
                                    {activeDevice?.deviceName || "No device"}
                                </p>
                                {activeDevice && (
                                    <Badge
                                        variant={activeDevice.isActive ? "default" : "secondary"}
                                        className="mt-1"
                                    >
                                        {activeDevice.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Summary - Privacy Compliant (Aggregated Data Only) */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Health Summary (Last 7 Days)</CardTitle>
                        <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Privacy Mode: Aggregated Data Only
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Heart Rate Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                                        <Heart className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg Heart Rate</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgHeartRate.toFixed(0) || "—"} <span className="text-sm font-normal text-muted-foreground">bpm</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SpO2 Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                                        <Activity className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg SpO2</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgSpO2.toFixed(1) || "—"} <span className="text-sm font-normal text-muted-foreground">%</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Steps Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                                        <Footprints className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg Steps</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgSteps.toFixed(0) || "—"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Calories Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                                        <Flame className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg Calories</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgCalories.toFixed(0) || "—"} <span className="text-sm font-normal text-muted-foreground">kcal</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Water Intake Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                                        <Droplet className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg Water Intake</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgWaterIntakeMl.toFixed(0) || "—"} <span className="text-sm font-normal text-muted-foreground">ml</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sleep Summary */}
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                                        <Moon className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Avg Sleep</p>
                                        <p className="text-xl font-bold">
                                            {overview?.healthSummary.avgSleepMinutes ? `${(overview.healthSummary.avgSleepMinutes / 60).toFixed(1)}h` : "—"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alert Statistics */}
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Card className="border-yellow-500/20 bg-yellow-500/5">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Alerts (7d)</p>
                                        <p className="text-2xl font-bold">{overview?.healthSummary.totalAlerts || 0}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">High Severity Alerts</p>
                                        <p className="text-2xl font-bold">{overview?.healthSummary.highSeverityAlerts || 0}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sync Status */}
                    <div className="mt-4">
                        <Card className="border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Sync</p>
                                        <p className="font-medium">{overview?.healthSummary.lastSyncTime || "Never"}</p>
                                    </div>
                                    <Badge variant={overview?.healthSummary.activeDevices ? "default" : "secondary"}>
                                        {overview?.healthSummary.activeDevices || 0} Active / {overview?.healthSummary.totalDevices || 0} Total Devices
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Privacy Notice */}
                    <div className="mt-4 rounded-lg border border-muted bg-muted/30 p-4">
                        <p className="text-xs text-muted-foreground">
                            <strong>Privacy Notice:</strong> This view displays only aggregated health statistics for the last 7 days.
                            Individual health data points are not accessible to maintain user privacy in compliance with data protection regulations.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
