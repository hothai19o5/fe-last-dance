import { apiClient } from '@/api';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    dob?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface RegisterResponse {
    message: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>('/login', credentials);
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return apiClient.post<RegisterResponse>('/register', data);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    setToken: (token: string) => {
        localStorage.setItem('token', token);
    },
};
