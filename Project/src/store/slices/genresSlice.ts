import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/axiosInstance';

export interface Genre {
  name: string;
  image?: string; // опционально, позже подставим картинки
}

interface GenresState {
  list: Genre[];
  loading: boolean;
  error: string | null;
}

const initialState: GenresState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('movie/genres');
      const genresArray = response.data as string[];
      return genresArray.map((name) => ({ name }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки жанров');
    }
  }
);

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = genresSlice.actions;
export default genresSlice.reducer;