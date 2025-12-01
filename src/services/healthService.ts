import type { DashboardStats, SystemHealth, DatabaseStatus, DeviceStats, ApiStats, ServiceStatus } from "@/types";

export const healthService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            totalUsers: 1247,
            activeUsersToday: 892,
            alertsLast24h: 23,
            devicesOnline: 1156,
        };
    },

    getSystemHealth: async (): Promise<SystemHealth> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            uptime: "15d 7h 23m",
            uptimeSeconds: 1324980,
            cpuUsage: 34,
            memoryUsage: 62,
            memoryTotal: "16 GB",
            memoryUsed: "9.92 GB",
            diskUsage: 45,
            diskTotal: "500 GB",
            diskUsed: "225 GB",
        };
    },

    getDatabaseStatus: async (): Promise<DatabaseStatus> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            status: "Connected",
            responseTime: 12,
            connections: 45,
            maxConnections: 100,
            lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            size: "2.4 GB",
        };
    },

    getDeviceStats: async (): Promise<DeviceStats> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            total: 1350,
            active: 1156,
            inactive: 194,
            lowBattery: 47,
        };
    },

    getApiStats: async (): Promise<ApiStats> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return {
            requestsPerMinute: 1250,
            avgResponseTime: 45,
            errorRate: 0.12,
            successRate: 99.88,
        };
    },

    getServiceStatuses: async (): Promise<ServiceStatus[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return [
            {
                name: "API Gateway",
                status: "Running",
                uptime: "15d 7h 23m",
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Auth Service",
                status: "Running",
                uptime: "15d 7h 20m",
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Data Processing",
                status: "Running",
                uptime: "14d 22h 15m",
                lastCheck: new Date().toISOString(),
            },
            {
                name: "ML Inference",
                status: "Running",
                uptime: "10d 5h 30m",
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Notification Service",
                status: "Warning",
                uptime: "2d 3h 45m",
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Backup Service",
                status: "Running",
                uptime: "15d 7h 23m",
                lastCheck: new Date().toISOString(),
            },
        ];
    },
};
