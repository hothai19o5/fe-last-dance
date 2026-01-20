import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Wifi, WifiOff, ChevronLeft, ChevronRight, MoreHorizontal, Power, PowerOff, Trash2 } from "lucide-react";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<"enable" | "disable" | "delete" | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

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

    useEffect(() => {
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

    const handleAction = (device: Device, action: "enable" | "disable" | "delete") => {
        setSelectedDevice(device);
        setDialogAction(action);
        setDialogOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedDevice || !dialogAction) return;

        setActionLoading(true);
        try {
            if (dialogAction === "enable") {
                await deviceService.enableDevice(selectedDevice.id);
            } else if (dialogAction === "disable") {
                await deviceService.disableDevice(selectedDevice.id);
            } else if (dialogAction === "delete") {
                await deviceService.deleteDevice(selectedDevice.id);
            }
            await fetchDevices();
        } catch (error) {
            console.error(`Error ${dialogAction}ing device:`, error);
        } finally {
            setActionLoading(false);
            setDialogOpen(false);
            setSelectedDevice(null);
            setDialogAction(null);
        }
    };

    const getDialogContent = () => {
        if (!selectedDevice || !dialogAction) return { title: "", description: "" };

        switch (dialogAction) {
            case "enable":
                return {
                    title: "Enable Device",
                    description: `Are you sure you want to enable device "${selectedDevice.deviceName}"?`,
                };
            case "disable":
                return {
                    title: "Disable Device",
                    description: `Are you sure you want to disable device "${selectedDevice.deviceName}"?`,
                };
            case "delete":
                return {
                    title: "Delete Device",
                    description: `Are you sure you want to delete device "${selectedDevice.deviceName}"? This action cannot be undone.`,
                };
        }
    };

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
                                    <TableHead>Actions</TableHead>
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
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {device.isActive ? (
                                                        <DropdownMenuItem onClick={() => handleAction(device, "disable")}>
                                                            <PowerOff className="mr-2 h-4 w-4" />
                                                            Disable
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleAction(device, "enable")}>
                                                            <Power className="mr-2 h-4 w-4" />
                                                            Enable
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction(device, "delete")}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{getDialogContent().title}</DialogTitle>
                        <DialogDescription>{getDialogContent().description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant={dialogAction === "delete" ? "destructive" : "default"}
                            onClick={confirmAction}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Processing..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
