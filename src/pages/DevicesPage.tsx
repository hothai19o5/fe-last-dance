import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Wifi, WifiOff, ChevronLeft, ChevronRight } from "lucide-react";
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
    Button,
} from "@/components/ui";
import { deviceService } from "@/services";
import type { Device } from "@/types";

export function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoading(true);
                const response = await deviceService.getDevices({ page, size: 10 });
                setDevices(response.content);
                setFilteredDevices(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, [page]);

    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredDevices(devices);
        } else {
            const isActive = statusFilter === "active";
            setFilteredDevices(
                devices.filter((device) => device.isActive === isActive)
            );
        }
    }, [statusFilter, devices]);

    const stats = {
        total: devices.length,
        active: devices.filter((d) => d.isActive).length,
        inactive: devices.filter((d) => !d.isActive).length,
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="mt-1 text-2xl font-bold">{stats.active}</p>
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
                                <p className="text-sm text-muted-foreground">Inactive</p>
                                <p className="mt-1 text-2xl font-bold">{stats.inactive}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <WifiOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Device UUID</TableHead>
                                    <TableHead>Device Name</TableHead>
                                    <TableHead>Assigned User</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDevices.map((device) => (
                                    <TableRow key={device.id}>
                                        <TableCell className="font-mono text-sm">
                                            {device.id}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {device.deviceUuid}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {device.deviceName}
                                        </TableCell>
                                        <TableCell>
                                            {device.username}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={device.isActive ? "default" : "secondary"}
                                                className="gap-1"
                                            >
                                                {device.isActive ? (
                                                    <Wifi className="h-3 w-3" />
                                                ) : (
                                                    <WifiOff className="h-3 w-3" />
                                                )}
                                                {device.isActive ? "Active" : "Inactive"}
                                            </Badge>
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

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
