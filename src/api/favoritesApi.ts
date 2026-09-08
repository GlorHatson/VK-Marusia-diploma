import { apiClient } from './axiosInstance';
import type { Movie } from '../store/slices/moviesSlice';

export const favoritesApi = {
  getFavorites: () => apiClient.get<Movie[]>('/favorites'),
  addFavorite: (movieId: number) => {
    const formData = new URLSearchParams();
    formData.append('id', movieId.toString());
    return apiClient.post('/favorites', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  removeFavorite: (movieId: number) => apiClient.delete(`/favorites/${movieId}`),
};