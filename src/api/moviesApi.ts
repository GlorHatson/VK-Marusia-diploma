import { apiClient } from './axiosInstance';
import type { Movie } from '../store/slices/moviesSlice';

export const moviesApi = {
  fetchTop10: () => apiClient.get<Movie[]>('/movie/top10'),
  fetchRandomMovie: () => apiClient.get<Movie>('/movie/random'),
  fetchMovieById: (id: number) => apiClient.get<Movie>(`/movie/${id}`),
  fetchMoviesByGenre: (genre: string, page: number, count: number = 10) =>
    apiClient.get<Movie[]>('/movie', { params: { genre, page, count } }),
  searchMovies: (title: string, count: number = 10) =>
    apiClient.get<Movie[]>('/movie', { params: { title: title.trim(), count } }),
};