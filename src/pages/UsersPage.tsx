import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
} from "@/components/ui";
import { userService } from "@/services";
import { formatDateTime } from "@/lib/utils";
import type { User } from "@/types";

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            result = result.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((user) => user.status === statusFilter);
        }

        setFilteredUsers(result);
    }, [searchQuery, statusFilter, users]);

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
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="Offline">Offline</SelectItem>
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
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Age</TableHead>
                                    <TableHead className="hidden md:table-cell">Gender</TableHead>
                                    <TableHead className="hidden lg:table-cell">Height</TableHead>
                                    <TableHead className="hidden lg:table-cell">Weight</TableHead>
                                    <TableHead className="hidden sm:table-cell">Device ID</TableHead>
                                    <TableHead className="hidden xl:table-cell">Last Active</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="cursor-pointer transition-colors hover:bg-muted/50"
                                        onClick={() => navigate(`/users/${user.id}`)}
                                    >
                                        <TableCell className="font-mono text-sm">
                                            {user.id}
                                        </TableCell>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {user.age}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {user.gender}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {user.height} cm
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {user.weight} kg
                                        </TableCell>
                                        <TableCell className="hidden font-mono text-sm sm:table-cell">
                                            {user.deviceId}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            {formatDateTime(user.lastActiveTime)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.status === "Online" ? "default" : "secondary"}
                                            >
                                                {user.status}
                                            </Badge>
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
                </CardContent>
            </Card>
        </motion.div>
    );
}
