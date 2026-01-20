import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, UserCheck, UserX, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
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
import { userService } from "@/services";
import type { User } from "@/types";

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<"enable" | "disable" | "delete" | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers({ page, size: 10 });
            setUsers(response.content);
            setFilteredUsers(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            result = result.filter((user) =>
                user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            const isEnabled = statusFilter === "enabled";
            result = result.filter((user) => user.enabled === isEnabled);
        }

        setFilteredUsers(result);
    }, [searchQuery, statusFilter, users]);

    const handleAction = (user: User, action: "enable" | "disable" | "delete") => {
        setSelectedUser(user);
        setDialogAction(action);
        setDialogOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedUser || !dialogAction) return;

        setActionLoading(true);
        try {
            if (dialogAction === "enable") {
                await userService.enableUser(selectedUser.id);
            } else if (dialogAction === "disable") {
                await userService.disableUser(selectedUser.id);
            } else if (dialogAction === "delete") {
                await userService.deleteUser(selectedUser.id);
            }
            await fetchUsers();
        } catch (error) {
            console.error(`Error ${dialogAction}ing user:`, error);
        } finally {
            setActionLoading(false);
            setDialogOpen(false);
            setSelectedUser(null);
            setDialogAction(null);
        }
    };

    const getDialogContent = () => {
        if (!selectedUser || !dialogAction) return { title: "", description: "" };

        switch (dialogAction) {
            case "enable":
                return {
                    title: "Enable User",
                    description: `Are you sure you want to enable user "${selectedUser.username}"? They will be able to access the system.`,
                };
            case "disable":
                return {
                    title: "Disable User",
                    description: `Are you sure you want to disable user "${selectedUser.username}"? They will not be able to access the system.`,
                };
            case "delete":
                return {
                    title: "Delete User",
                    description: `Are you sure you want to delete user "${selectedUser.username}"? This action cannot be undone.`,
                };
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
                <h1 className="text-2xl font-bold">Users Management</h1>
                <p className="text-muted-foreground">
                    View and manage all registered users
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>All Users</CardTitle>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 sm:w-64"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="enabled">Enabled</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Gender</TableHead>
                                    <TableHead className="hidden lg:table-cell">Height (m)</TableHead>
                                    <TableHead className="hidden lg:table-cell">Weight (kg)</TableHead>
                                    <TableHead className="hidden xl:table-cell">BMI</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="cursor-pointer transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell
                                            className="font-mono text-sm"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.id}
                                        </TableCell>
                                        <TableCell
                                            className="font-medium"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.username}
                                        </TableCell>
                                        <TableCell onClick={() => navigate(`/users/${user.id}`)}>
                                            {user.fullName}
                                        </TableCell>
                                        <TableCell
                                            className="hidden md:table-cell"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.gender || "-"}
                                        </TableCell>
                                        <TableCell
                                            className="hidden lg:table-cell"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.heightM ?? "-"}
                                        </TableCell>
                                        <TableCell
                                            className="hidden lg:table-cell"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.weightKg ?? "-"}
                                        </TableCell>
                                        <TableCell
                                            className="hidden xl:table-cell"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            {user.bmi?.toFixed(1) ?? "-"}
                                        </TableCell>
                                        <TableCell onClick={() => navigate(`/users/${user.id}`)}>
                                            <Badge
                                                variant={user.enabled ? "default" : "secondary"}
                                            >
                                                {user.enabled ? "Enabled" : "Disabled"}
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
                                                    {user.enabled ? (
                                                        <DropdownMenuItem onClick={() => handleAction(user, "disable")}>
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Disable
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleAction(user, "enable")}>
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            Enable
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction(user, "delete")}
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

                    {filteredUsers.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            No users found matching your criteria.
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
