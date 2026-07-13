import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../store/slices/userSlice';
import { setAuthModalOpen } from '../store/slices/uiSlice';

export const apiClient = axios.create({
  baseURL: 'https://cinemaguide.skillbox.cc/',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Обработка 401 – разлогиниваем и открываем модалку (кроме эндпоинтов аутентификации)
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/user')
    ) {
      originalRequest._retry = true;
      store.dispatch(logout());
      store.dispatch(setAuthModalOpen(true));
      return Promise.reject(error);
    }

    // Обработка 500 и других серверных ошибок
    if (status && status >= 500) {
      console.error('Серверная ошибка:', error.message);
    }

    return Promise.reject(error);
  }
);