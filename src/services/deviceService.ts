import type { Device } from "@/types";

const devices: Device[] = [
    {
        id: "DEV001",
        assignedUserId: "USR001",
        assignedUserName: "John Smith",
        batteryLevel: 85,
        connectionStatus: "Connected",
        lastPingTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV002",
        assignedUserId: "USR002",
        assignedUserName: "Sarah Johnson",
        batteryLevel: 92,
        connectionStatus: "Connected",
        lastPingTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV003",
        assignedUserId: "USR003",
        assignedUserName: "Michael Brown",
        batteryLevel: 15,
        connectionStatus: "Disconnected",
        lastPingTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV004",
        assignedUserId: "USR004",
        assignedUserName: "Emily Davis",
        batteryLevel: 67,
        connectionStatus: "Connected",
        lastPingTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV005",
        assignedUserId: "USR005",
        assignedUserName: "Robert Wilson",
        batteryLevel: 5,
        connectionStatus: "Disconnected",
        lastPingTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV006",
        assignedUserId: "USR006",
        assignedUserName: "Lisa Anderson",
        batteryLevel: 78,
        connectionStatus: "Connected",
        lastPingTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV007",
        assignedUserId: "USR007",
        assignedUserName: "David Martinez",
        batteryLevel: 45,
        connectionStatus: "Connected",
        lastPingTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
        id: "DEV008",
        assignedUserId: "USR008",
        assignedUserName: "Jennifer Taylor",
        batteryLevel: 0,
        connectionStatus: "Disconnected",
        lastPingTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
];

export const deviceService = {
    getDevices: async (): Promise<Device[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return devices;
    },

    getDeviceById: async (id: string): Promise<Device | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return devices.find((d) => d.id === id);
    },

    getDeviceByUserId: async (userId: string): Promise<Device | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return devices.find((d) => d.assignedUserId === userId);
    },

    filterByStatus: async (
        status: "Connected" | "Disconnected"
    ): Promise<Device[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return devices.filter((d) => d.connectionStatus === status);
    },
};
