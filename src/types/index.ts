export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    profilePictureUrl?: string;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    weightKg?: number;
    heightM?: number;
    bmi?: number;
    enabled: boolean;
    devices: ApiDevice[];
}

export interface ApiDevice {
    id: number;
    deviceUuid: string;
    deviceName: string;
    isActive: boolean;
    userId: number;
    username: string;
}

export interface HealthMetric {
    timestamp: string;
    heartRate: number;
    spo2: number;
    stepCount: number;
}

export interface HealthDataResponse {
    deviceUuid: string;
    dataPoints: HealthMetric[];
}

export interface Alert {
    id: string;
    userId: string;
    userName: string;
    timestamp: string;
    heartRate: number;
    spO2: number;
    mlScore: number;
    severity: "Low" | "Medium" | "High";
    status: "New" | "Viewed" | "Resolved";
}

export interface Device {
    id: number;
    deviceUuid: string;
    deviceName: string;
    isActive: boolean;
    userId: number;
    username: string;
}

export interface DashboardResponse {
    apiUsageStats: {
        requestsPerMinute: number;
        averageResponseTimeMs: number;
        successRatePercentage: number;
    };
    usersStats: {
        totalUsers: number;
        activeUsers: number;
    };
    devicesStats: {
        totalDevices: number;
        activeDevices: number;
        inactiveDevices: number;
    };
    databaseStats: {
        responseTimeMs: number;
        connectionPoolSize: number;
        activeConnections: number;
        databaseSizeGB: number;
        connected: boolean;
    };
    serverStats: {
        uptime: number;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        totalMemoryGB: number;
        totalDiskGB: number;
    };
}

export interface DashboardStats {
    totalUsers: number;
    activeUsersToday: number;
    alertsLast24h: number;
    devicesOnline: number;
}

export interface SystemHealth {
    uptime: string;
    uptimeSeconds: number;
    cpuUsage: number;
    memoryUsage: number;
    memoryTotal: string;
    memoryUsed: string;
    diskUsage: number;
    diskTotal: string;
    diskUsed: string;
}

export interface DatabaseStatus {
    status: "Connected" | "Disconnected" | "Degraded";
    responseTime: number;
    connections: number;
    maxConnections: number;
    lastBackup: string;
    size: string;
}

export interface DeviceStats {
    total: number;
    active: number;
    inactive: number;
    lowBattery: number;
}

export interface ApiStats {
    requestsPerMinute: number;
    avgResponseTime: number;
    errorRate: number;
    successRate: number;
}

export interface ServiceStatus {
    name: string;
    status: "Running" | "Stopped" | "Warning";
    uptime: string;
    lastCheck: string;
}

export interface UpdateUserRequest {
    id: number;
    email?: string;
    fullName?: string;
    profilePictureUrl?: string;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    weightKg?: number;
    heightM?: number;
}

export interface DeviceConfigRequest {
    id: number;
    deviceUuid: string;
    deviceName: string;
    isActive: boolean;
    username: string;
}

export interface RegisterDeviceRequest {
    deviceUuid: string;
    deviceName: string;
    username: string;
}

export interface SyncHealthDataRequest {
    deviceUuid: string;
    dataPoints: {
        timestamp: string;
        heartRate?: number;
        spo2?: number;
        stepCount?: number;
    }[];
}
