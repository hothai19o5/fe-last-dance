export interface User {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    height: number;
    weight: number;
    deviceId: string;
    lastActiveTime: string;
    status: "Online" | "Offline";
    avatar?: string;
}

export interface HealthMetric {
    timestamp: string;
    heartRate: number;
    spO2: number;
    steps: number;
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
    id: string;
    assignedUserId: string;
    assignedUserName: string;
    batteryLevel: number;
    connectionStatus: "Connected" | "Disconnected";
    lastPingTime: string;
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
