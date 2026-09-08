import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, type RegisterData, type LoginData, type User } from '../../api/authApi';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'user/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      await authApi.login(data);
      const profileResponse = await authApi.getProfile();
      return profileResponse.data as User;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка входа';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка выхода';
      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      if (response.status === 401) {
        return null; // неавторизован
      }
      return response.data as User;
    } catch (error: any) {
      return rejectWithValue(null);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;