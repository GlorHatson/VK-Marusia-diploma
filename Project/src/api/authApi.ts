import { apiClient } from './axiosInstance';

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  favorites?: string[];
}

export const authApi = {
  register: (data: RegisterData) => apiClient.post('/user', data),
  login: (data: LoginData) => apiClient.post('/auth/login', data),
  logout: () => apiClient.get('/auth/logout'),
  getProfile: () => apiClient.get('/profile', { validateStatus: (status) => status < 500 }),
};