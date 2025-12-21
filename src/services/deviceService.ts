import { apiClient, type PaginatedResponse } from "@/api";
import type { Device, RegisterDeviceRequest, DeviceConfigRequest, SyncHealthDataRequest } from "@/types";

export interface GetDevicesParams {
    page?: number;
    size?: number;
    sortBy?: string;
}

export const deviceService = {
    getDevices: async (params: GetDevicesParams = {}): Promise<PaginatedResponse<Device>> => {
        const { page = 0, size = 10, sortBy = 'id' } = params;
        return apiClient.get<PaginatedResponse<Device>>('/devices', { page, size, sortBy });
    },

    registerDevice: async (data: RegisterDeviceRequest): Promise<Device> => {
        return apiClient.post<Device>('/device', data);
    },

    updateDeviceConfig: async (deviceId: number, data: DeviceConfigRequest): Promise<Device> => {
        return apiClient.put<Device>(`/devices/${deviceId}/config`, data);
    },

    syncHealthData: async (data: SyncHealthDataRequest): Promise<void> => {
        return apiClient.post<void>('/sync/health-data', data);
    },
};
