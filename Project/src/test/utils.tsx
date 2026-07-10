import type { ReactNode } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import moviesReducer from '../store/slices/moviesSlice';
import genresReducer from '../store/slices/genresSlice';
import genreMoviesReducer from '../store/slices/genreMoviesSlice';
import userReducer from '../store/slices/userSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import uiReducer from '../store/slices/uiSlice';
import searchReducer from '../store/slices/searchSlice';

const rootReducer = combineReducers({
  movies: moviesReducer,
  genres: genresReducer,
  genreMovies: genreMoviesReducer,
  user: userReducer,
  favorites: favoritesReducer,
  ui: uiReducer,
  search: searchReducer,
});

export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

interface WrapperProps {
  children: ReactNode;
  store?: ReturnType<typeof createTestStore>;
}

const AllProviders: React.FC<WrapperProps> = ({ children, store }) => {
  const testStore = store || createTestStore();
  return (
    <Provider store={testStore}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { store?: ReturnType<typeof createTestStore> }
) => {
  const { store, ...restOptions } = options || {};
  return render(ui, {
    wrapper: ({ children }) => <AllProviders store={store}>{children}</AllProviders>,
    ...restOptions,
  });
};