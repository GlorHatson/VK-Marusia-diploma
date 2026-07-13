import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../store/slices/moviesSlice';
import genresReducer from '../store/slices/genresSlice';
import genreMoviesReducer from '../store/slices/genreMoviesSlice';
import userReducer from '../store/slices/userSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import uiReducer from '../store/slices/uiSlice';
import searchReducer from '../store/slices/searchSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    genres: genresReducer,
    genreMovies: genreMoviesReducer,
    user: userReducer,
    favorites: favoritesReducer,
    ui: uiReducer, 
    search: searchReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;