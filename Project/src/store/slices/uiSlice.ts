import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isAuthModalOpen: boolean;
}

const initialState: UiState = {
  isAuthModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: { payload: boolean }) => {
      state.isAuthModalOpen = action.payload;
    },
  },
});

export const { setAuthModalOpen } = uiSlice.actions;
export default uiSlice.reducer;