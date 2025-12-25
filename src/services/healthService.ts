import { apiClient } from "@/api";
import type { DashboardResponse, DashboardStats, SystemHealth, DatabaseStatus, DeviceStats, ApiStats, ServiceStatus } from "@/types";

export const healthService = {
    getDashboard: async (): Promise<DashboardResponse> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        return response.data;
    },

    // Fetch all dashboard data in one API call
    getAllDashboardData: async () => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;

        const stats: DashboardStats = {
            totalUsers: dashboard.usersStats.totalUsers,
            activeUsersToday: dashboard.usersStats.activeUsers,
            alertsLast24h: 0,
            devicesOnline: dashboard.devicesStats.activeDevices,
        };

        const systemHealth: SystemHealth = {
            uptime: `${Math.floor(dashboard.serverStats.uptime / 3600)}h ${Math.floor((dashboard.serverStats.uptime % 3600) / 60)}m`,
            uptimeSeconds: dashboard.serverStats.uptime,
            cpuUsage: Number(dashboard.serverStats.cpuUsage.toFixed(2)),
            memoryUsage: Number(dashboard.serverStats.memoryUsage.toFixed(2)),
            memoryTotal: `${dashboard.serverStats.totalMemoryGB.toFixed(2)} GB`,
            memoryUsed: `${(dashboard.serverStats.totalMemoryGB * dashboard.serverStats.memoryUsage / 100).toFixed(2)} GB`,
            diskUsage: Number(dashboard.serverStats.diskUsage.toFixed(2)),
            diskTotal: `${dashboard.serverStats.totalDiskGB.toFixed(2)} GB`,
            diskUsed: `${(dashboard.serverStats.totalDiskGB * dashboard.serverStats.diskUsage / 100).toFixed(2)} GB`,
        };

        const databaseStatus: DatabaseStatus = {
            status: dashboard.databaseStats.connected ? "Connected" : "Disconnected",
            responseTime: dashboard.databaseStats.responseTimeMs,
            connections: dashboard.databaseStats.activeConnections,
            maxConnections: dashboard.databaseStats.connectionPoolSize,
            lastBackup: new Date().toISOString(),
            size: `${dashboard.databaseStats.databaseSizeGB.toFixed(3)} GB`,
        };

        const deviceStats: DeviceStats = {
            total: dashboard.devicesStats.totalDevices,
            active: dashboard.devicesStats.activeDevices,
            inactive: dashboard.devicesStats.inactiveDevices,
            lowBattery: 0,
        };

        const apiStats: ApiStats = {
            requestsPerMinute: Number(dashboard.apiUsageStats.requestsPerMinute.toFixed(2)),
            avgResponseTime: Number(dashboard.apiUsageStats.averageResponseTimeMs.toFixed(2)),
            errorRate: Number((100 - dashboard.apiUsageStats.successRatePercentage).toFixed(2)),
            successRate: Number(dashboard.apiUsageStats.successRatePercentage.toFixed(2)),
        };

        const services: ServiceStatus[] = [
            {
                name: "API Gateway",
                status: "Running",
                uptime: systemHealth.uptime,
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Database",
                status: databaseStatus.status === "Connected" ? "Running" : "Stopped",
                uptime: systemHealth.uptime,
                lastCheck: new Date().toISOString(),
            },
        ];

        return {
            stats,
            systemHealth,
            databaseStatus,
            deviceStats,
            apiStats,
            services,
        };
    },

    // Legacy methods for backward compatibility (deprecated)
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        return {
            totalUsers: dashboard.usersStats.totalUsers,
            activeUsersToday: dashboard.usersStats.activeUsers,
            alertsLast24h: 0,
            devicesOnline: dashboard.devicesStats.activeDevices,
        };
    },

    getSystemHealth: async (): Promise<SystemHealth> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        return {
            uptime: `${Math.floor(dashboard.serverStats.uptime / 3600)}h ${Math.floor((dashboard.serverStats.uptime % 3600) / 60)}m`,
            uptimeSeconds: dashboard.serverStats.uptime,
            cpuUsage: Number(dashboard.serverStats.cpuUsage.toFixed(2)),
            memoryUsage: Number(dashboard.serverStats.memoryUsage.toFixed(2)),
            memoryTotal: `${dashboard.serverStats.totalMemoryGB.toFixed(2)} GB`,
            memoryUsed: `${(dashboard.serverStats.totalMemoryGB * dashboard.serverStats.memoryUsage / 100).toFixed(2)} GB`,
            diskUsage: Number(dashboard.serverStats.diskUsage.toFixed(2)),
            diskTotal: `${dashboard.serverStats.totalDiskGB.toFixed(2)} GB`,
            diskUsed: `${(dashboard.serverStats.totalDiskGB * dashboard.serverStats.diskUsage / 100).toFixed(2)} GB`,
        };
    },

    getDatabaseStatus: async (): Promise<DatabaseStatus> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        return {
            status: dashboard.databaseStats.connected ? "Connected" : "Disconnected",
            responseTime: dashboard.databaseStats.responseTimeMs,
            connections: dashboard.databaseStats.activeConnections,
            maxConnections: dashboard.databaseStats.connectionPoolSize,
            lastBackup: new Date().toISOString(),
            size: `${dashboard.databaseStats.databaseSizeGB.toFixed(3)} GB`,
        };
    },

    getDeviceStats: async (): Promise<DeviceStats> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        return {
            total: dashboard.devicesStats.totalDevices,
            active: dashboard.devicesStats.activeDevices,
            inactive: dashboard.devicesStats.inactiveDevices,
            lowBattery: 0,
        };
    },

    getApiStats: async (): Promise<ApiStats> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        return {
            requestsPerMinute: Number(dashboard.apiUsageStats.requestsPerMinute.toFixed(2)),
            avgResponseTime: Number(dashboard.apiUsageStats.averageResponseTimeMs.toFixed(2)),
            errorRate: Number((100 - dashboard.apiUsageStats.successRatePercentage).toFixed(2)),
            successRate: Number(dashboard.apiUsageStats.successRatePercentage.toFixed(2)),
        };
    },

    getServiceStatuses: async (): Promise<ServiceStatus[]> => {
        const response = await apiClient.get<{ data: DashboardResponse }>('/dashboard');
        const dashboard = response.data;
        const uptime = `${Math.floor(dashboard.serverStats.uptime / 3600)}h ${Math.floor((dashboard.serverStats.uptime % 3600) / 60)}m`;
        return [
            {
                name: "API Gateway",
                status: "Running",
                uptime,
                lastCheck: new Date().toISOString(),
            },
            {
                name: "Database",
                status: dashboard.databaseStats.connected ? "Running" : "Stopped",
                uptime,
                lastCheck: new Date().toISOString(),
            },
        ];
    },
};
