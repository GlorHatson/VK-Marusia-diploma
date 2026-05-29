import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../store/slices/moviesSlice';
import genresReducer from '../store/slices/genresSlice';
import genreMoviesReducer from '../store/slices/genreMoviesSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    genres: genresReducer,
    genreMovies: genreMoviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;