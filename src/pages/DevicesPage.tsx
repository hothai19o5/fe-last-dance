import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Battery, Wifi, WifiOff, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { deviceService } from "@/services";
import { formatDateTime } from "@/lib/utils";
import type { Device } from "@/types";

export function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const data = await deviceService.getDevices();
                setDevices(data);
                setFilteredDevices(data);
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredDevices(devices);
        } else {
            setFilteredDevices(
                devices.filter((device) => device.connectionStatus === statusFilter)
            );
        }
    }, [statusFilter, devices]);

    const getBatteryColor = (level: number) => {
        if (level <= 20) return "text-destructive";
        if (level <= 50) return "text-muted-foreground";
        return "text-foreground";
    };

    const getBatteryIcon = (level: number) => {
        return (
            <div className="flex items-center gap-2">
                <Battery className={`h-4 w-4 ${getBatteryColor(level)}`} />
                <span className={getBatteryColor(level)}>{level}%</span>
            </div>
        );
    };

    const stats = {
        total: devices.length,
        connected: devices.filter((d) => d.connectionStatus === "Connected").length,
        disconnected: devices.filter((d) => d.connectionStatus === "Disconnected")
            .length,
        lowBattery: devices.filter((d) => d.batteryLevel <= 20).length,
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl font-bold">Devices</h1>
                <p className="text-muted-foreground">
                    Manage and monitor all IoT devices
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Devices</p>
                                <p className="mt-1 text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <Cpu className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Connected</p>
                                <p className="mt-1 text-2xl font-bold">{stats.connected}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <Wifi className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Disconnected</p>
                                <p className="mt-1 text-2xl font-bold">{stats.disconnected}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <WifiOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Low Battery</p>
                                <p className="mt-1 text-2xl font-bold">{stats.lowBattery}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <Battery className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Devices Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>All Devices</CardTitle>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Connected">Connected</SelectItem>
                                <SelectItem value="Disconnected">Disconnected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Device ID</TableHead>
                                    <TableHead>Assigned User</TableHead>
                                    <TableHead>Battery</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Last Ping
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDevices.map((device) => (
                                    <TableRow key={device.id}>
                                        <TableCell className="font-mono text-sm">
                                            {device.id}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {device.assignedUserName}
                                        </TableCell>
                                        <TableCell>{getBatteryIcon(device.batteryLevel)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    device.connectionStatus === "Connected"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="gap-1"
                                            >
                                                {device.connectionStatus === "Connected" ? (
                                                    <Wifi className="h-3 w-3" />
                                                ) : (
                                                    <WifiOff className="h-3 w-3" />
                                                )}
                                                {device.connectionStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatDateTime(device.lastPingTime)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredDevices.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            No devices found matching your criteria.
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
