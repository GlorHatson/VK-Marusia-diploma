import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../api/favoritesApi';
import type { Movie } from './moviesSlice';

interface FavoritesState {
  items: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки избранного');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (movieId: number, { dispatch, rejectWithValue }) => {
    try {
      await favoritesApi.addFavorite(movieId);
      await dispatch(fetchFavorites()); // перезагружаем список
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (movieId: number, { dispatch, rejectWithValue }) => {
    try {
      await favoritesApi.removeFavorite(movieId);
      await dispatch(fetchFavorites());
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;