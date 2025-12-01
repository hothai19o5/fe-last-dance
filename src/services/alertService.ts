import type { Alert } from "@/types";

const alerts: Alert[] = [
    {
        id: "ALT001",
        userId: "USR001",
        userName: "John Smith",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        heartRate: 142,
        spO2: 88,
        mlScore: 0.92,
        severity: "High",
        status: "New",
    },
    {
        id: "ALT002",
        userId: "USR003",
        userName: "Michael Brown",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        heartRate: 115,
        spO2: 91,
        mlScore: 0.75,
        severity: "Medium",
        status: "Viewed",
    },
    {
        id: "ALT003",
        userId: "USR005",
        userName: "Robert Wilson",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        heartRate: 98,
        spO2: 93,
        mlScore: 0.45,
        severity: "Low",
        status: "Resolved",
    },
    {
        id: "ALT004",
        userId: "USR002",
        userName: "Sarah Johnson",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        heartRate: 135,
        spO2: 89,
        mlScore: 0.88,
        severity: "High",
        status: "Viewed",
    },
    {
        id: "ALT005",
        userId: "USR007",
        userName: "David Martinez",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        heartRate: 108,
        spO2: 92,
        mlScore: 0.62,
        severity: "Medium",
        status: "New",
    },
    {
        id: "ALT006",
        userId: "USR004",
        userName: "Emily Davis",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        heartRate: 95,
        spO2: 94,
        mlScore: 0.38,
        severity: "Low",
        status: "Resolved",
    },
    {
        id: "ALT007",
        userId: "USR006",
        userName: "Lisa Anderson",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        heartRate: 128,
        spO2: 90,
        mlScore: 0.81,
        severity: "High",
        status: "Resolved",
    },
    {
        id: "ALT008",
        userId: "USR001",
        userName: "John Smith",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        heartRate: 112,
        spO2: 91,
        mlScore: 0.58,
        severity: "Medium",
        status: "Resolved",
    },
];

export const alertService = {
    getAlerts: async (): Promise<Alert[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return alerts;
    },

    getAlertById: async (id: string): Promise<Alert | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return alerts.find((a) => a.id === id);
    },

    filterBySeverity: async (
        severity: "Low" | "Medium" | "High"
    ): Promise<Alert[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return alerts.filter((a) => a.severity === severity);
    },

    filterByStatus: async (
        status: "New" | "Viewed" | "Resolved"
    ): Promise<Alert[]> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return alerts.filter((a) => a.status === status);
    },

    markAsResolved: async (id: string): Promise<Alert | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const alert = alerts.find((a) => a.id === id);
        if (alert) {
            alert.status = "Resolved";
        }
        return alert;
    },

    markAsViewed: async (id: string): Promise<Alert | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const alert = alerts.find((a) => a.id === id);
        if (alert && alert.status === "New") {
            alert.status = "Viewed";
        }
        return alert;
    },
};
