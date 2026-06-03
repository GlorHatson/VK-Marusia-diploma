import { apiClient } from './axiosInstance';

export interface FavoriteMovie {
  id: number;
  title?: string;
  posterUrl?: string;
  // другие поля, если вернутся с сервера
}

export const favoritesApi = {
  getFavorites: () => apiClient.get<FavoriteMovie[]>('/favorites'),
  addFavorite: (movieId: number) => {
    const formData = new URLSearchParams();
    formData.append('id', movieId.toString());
    return apiClient.post('/favorites', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  removeFavorite: (movieId: number) => apiClient.delete(`/favorites/${movieId}`),
};