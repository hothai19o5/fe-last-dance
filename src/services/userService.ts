import { apiClient, type PaginatedResponse } from "@/api";
import type { User, Device, HealthDataResponse, UpdateUserRequest } from "@/types";

export interface GetUsersParams {
    page?: number;
    size?: number;
    sortBy?: string;
}

export interface UserOverview {
    userId: number;
    username: string;
    email: string;
    healthSummary: {
        avgHeartRate: number;
        avgSpO2: number;
        avgSteps: number;
        avgCalories: number;
        avgWaterIntakeMl: number;
        avgSleepMinutes: number;
        totalDevices: number;
        activeDevices: number;
        totalAlerts: number;
        highSeverityAlerts: number;
        lastSyncTime: string;
    };
}

export const userService = {
    getUsers: async (params: GetUsersParams = {}): Promise<PaginatedResponse<User>> => {
        const { page = 0, size = 10, sortBy = 'id' } = params;
        return apiClient.get<PaginatedResponse<User>>('/users', { page, size, sortBy });
    },

    getUserById: async (id: number): Promise<User> => {
        return apiClient.get<User>(`/user/${id}`);
    },

    getUserDevices: async (userId: number): Promise<Device[]> => {
        return apiClient.get<Device[]>(`/user/${userId}/devices`);
    },

    updateUser: async (data: UpdateUserRequest): Promise<User> => {
        return apiClient.patch<User>('/user', data);
    },

    changePassword: async (
        userId: number,
        oldPassword: string,
        newPassword: string
    ): Promise<void> => {
        return apiClient.patch<void>(
            `/user/${userId}/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`
        );
    },

    getUserHealthData: async (
        userId: number,
        deviceUuid: string,
        startDate: string,
        endDate?: string
    ): Promise<HealthDataResponse> => {
        const params: Record<string, string> = { startDate };
        if (endDate) params.endDate = endDate;
        return apiClient.get<HealthDataResponse>(
            `/user/${userId}/${deviceUuid}/health-data`,
            params
        );
    },

    getUserOverview: async (userId: number): Promise<UserOverview> => {
        return apiClient.get<UserOverview>(`/admin/users/${userId}/overview`);
    },

    enableUser: async (userId: number): Promise<void> => {
        return apiClient.patch<void>(`/user/${userId}/enable`);
    },

    disableUser: async (userId: number): Promise<void> => {
        return apiClient.patch<void>(`/user/${userId}/disable`);
    },

    deleteUser: async (userId: number): Promise<void> => {
        return apiClient.delete<void>(`/user/${userId}`);
    },
};
