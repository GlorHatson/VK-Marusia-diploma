import { vi } from 'vitest';

export const mockMovies = [
  { id: 1, title: 'Movie 1', posterUrl: 'https://example.com/1.jpg' },
  { id: 2, title: 'Movie 2', posterUrl: 'https://example.com/2.jpg' },
];

export const mockRandomMovie = {
  id: 10,
  title: 'Random Movie',
  posterUrl: 'https://example.com/random.jpg',
  backdropUrl: 'https://example.com/random-backdrop.jpg',
  tmdbRating: 8.5,
  releaseYear: 2024,
  genres: ['Action'],
  runtime: 120,
  plot: 'Random plot',
  trailerYouTubeId: 'abc123',
};

export const mockApiClient = {
  get: vi.fn(),
};