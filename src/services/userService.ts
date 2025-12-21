import { apiClient, type PaginatedResponse } from "@/api";
import type { User, Device, HealthDataResponse, UpdateUserRequest } from "@/types";

export interface GetUsersParams {
    page?: number;
    size?: number;
    sortBy?: string;
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
};
