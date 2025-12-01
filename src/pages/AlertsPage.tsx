import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Eye, Filter } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Button,
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui";
import { alertService } from "@/services";
import { formatDateTime } from "@/lib/utils";
import type { Alert } from "@/types";

export function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [severityFilter, setSeverityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await alertService.getAlerts();
                setAlerts(data);
                setFilteredAlerts(data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    useEffect(() => {
        let result = alerts;

        if (severityFilter !== "all") {
            result = result.filter((alert) => alert.severity === severityFilter);
        }

        if (statusFilter !== "all") {
            result = result.filter((alert) => alert.status === statusFilter);
        }

        setFilteredAlerts(result);
    }, [severityFilter, statusFilter, alerts]);

    const handleViewAlert = async (alert: Alert) => {
        setSelectedAlert(alert);
        setDialogOpen(true);

        if (alert.status === "New") {
            await alertService.markAsViewed(alert.id);
            setAlerts((prev) =>
                prev.map((a) =>
                    a.id === alert.id ? { ...a, status: "Viewed" } : a
                )
            );
        }
    };

    const handleResolveAlert = async () => {
        if (!selectedAlert) return;

        await alertService.markAsResolved(selectedAlert.id);
        setAlerts((prev) =>
            prev.map((a) =>
                a.id === selectedAlert.id ? { ...a, status: "Resolved" } : a
            )
        );
        setSelectedAlert((prev) => (prev ? { ...prev, status: "Resolved" } : null));
    };

    const getSeverityVariant = (severity: string) => {
        switch (severity) {
            case "High":
                return "destructive";
            case "Medium":
                return "warning";
            default:
                return "secondary";
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "New":
                return "destructive";
            case "Viewed":
                return "warning";
            default:
                return "success";
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl font-bold">Alerts</h1>
                <p className="text-muted-foreground">
                    Monitor and manage health alerts
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            All Alerts
                        </CardTitle>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Filters:</span>
                            </div>
                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severity</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Viewed">Viewed</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Alert ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="hidden md:table-cell">Time</TableHead>
                                    <TableHead className="hidden sm:table-cell">HR</TableHead>
                                    <TableHead className="hidden sm:table-cell">SpO2</TableHead>
                                    <TableHead className="hidden lg:table-cell">ML Score</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAlerts.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell className="font-mono text-sm">
                                            {alert.id}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {alert.userName}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {formatDateTime(alert.timestamp)}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {alert.heartRate} BPM
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {alert.spO2}%
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {(alert.mlScore * 100).toFixed(0)}%
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getSeverityVariant(alert.severity) as "destructive" | "default" | "secondary" | "outline" | "success" | "warning"}>
                                                {alert.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(alert.status) as "destructive" | "default" | "secondary" | "outline" | "success" | "warning"}>
                                                {alert.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewAlert(alert)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredAlerts.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            No alerts found matching your criteria.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Alert Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alert Details</DialogTitle>
                        <DialogDescription>
                            Alert ID: {selectedAlert?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAlert && (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">User</p>
                                    <p className="font-medium">{selectedAlert.userName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Time</p>
                                    <p className="font-medium">
                                        {formatDateTime(selectedAlert.timestamp)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Heart Rate</p>
                                    <p className="font-medium">{selectedAlert.heartRate} BPM</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">SpO2</p>
                                    <p className="font-medium">{selectedAlert.spO2}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">ML Score</p>
                                    <p className="font-medium">
                                        {(selectedAlert.mlScore * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Severity</p>
                                    <Badge variant={getSeverityVariant(selectedAlert.severity) as "destructive" | "default" | "secondary" | "outline" | "success" | "warning"}>
                                        {selectedAlert.severity}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={getStatusVariant(selectedAlert.status) as "destructive" | "default" | "secondary" | "outline" | "success" | "warning"}>
                                    {selectedAlert.status}
                                </Badge>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {selectedAlert?.status !== "Resolved" && (
                            <Button onClick={handleResolveAlert}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Resolved
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
