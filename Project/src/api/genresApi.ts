import { apiClient } from './axiosInstance';

export const genresApi = {
  fetchGenres: () => apiClient.get<string[]>('/movie/genres'),
};