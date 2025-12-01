import type { User, HealthMetric } from "@/types";

const users: User[] = [
    {
        id: "USR001",
        name: "John Smith",
        email: "john.smith@email.com",
        age: 45,
        gender: "Male",
        height: 175,
        weight: 78,
        deviceId: "DEV001",
        lastActiveTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: "Online",
    },
    {
        id: "USR002",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        age: 32,
        gender: "Female",
        height: 165,
        weight: 62,
        deviceId: "DEV002",
        lastActiveTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "Online",
    },
    {
        id: "USR003",
        name: "Michael Brown",
        email: "m.brown@email.com",
        age: 58,
        gender: "Male",
        height: 180,
        weight: 85,
        deviceId: "DEV003",
        lastActiveTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "Offline",
    },
    {
        id: "USR004",
        name: "Emily Davis",
        email: "emily.d@email.com",
        age: 28,
        gender: "Female",
        height: 160,
        weight: 55,
        deviceId: "DEV004",
        lastActiveTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: "Online",
    },
    {
        id: "USR005",
        name: "Robert Wilson",
        email: "r.wilson@email.com",
        age: 67,
        gender: "Male",
        height: 170,
        weight: 90,
        deviceId: "DEV005",
        lastActiveTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: "Offline",
    },
    {
        id: "USR006",
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
        age: 41,
        gender: "Female",
        height: 168,
        weight: 65,
        deviceId: "DEV006",
        lastActiveTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: "Online",
    },
    {
        id: "USR007",
        name: "David Martinez",
        email: "d.martinez@email.com",
        age: 52,
        gender: "Male",
        height: 178,
        weight: 82,
        deviceId: "DEV007",
        lastActiveTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: "Online",
    },
    {
        id: "USR008",
        name: "Jennifer Taylor",
        email: "j.taylor@email.com",
        age: 36,
        gender: "Female",
        height: 162,
        weight: 58,
        deviceId: "DEV008",
        lastActiveTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: "Offline",
    },
];

export const userService = {
    getUsers: async (): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return users;
    },

    getUserById: async (id: string): Promise<User | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return users.find((u) => u.id === id);
    },

    searchUsers: async (query: string): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return users.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase())
        );
    },

    filterByStatus: async (status: "Online" | "Offline"): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return users.filter((u) => u.status === status);
    },

    getUserHealthMetrics: async (
        _userId: string,
        timeRange: "1h" | "today" | "7d"
    ): Promise<HealthMetric[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const now = new Date();
        const metrics: HealthMetric[] = [];

        let points: number;
        let intervalMs: number;

        switch (timeRange) {
            case "1h":
                points = 12;
                intervalMs = 5 * 60 * 1000;
                break;
            case "today":
                points = 24;
                intervalMs = 60 * 60 * 1000;
                break;
            case "7d":
                points = 7 * 24;
                intervalMs = 60 * 60 * 1000;
                break;
        }

        for (let i = points - 1; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * intervalMs);
            metrics.push({
                timestamp: timestamp.toISOString(),
                heartRate: Math.floor(60 + Math.random() * 40),
                spO2: Math.floor(94 + Math.random() * 6),
                steps: Math.floor(Math.random() * 500),
            });
        }

        return metrics;
    },
};
