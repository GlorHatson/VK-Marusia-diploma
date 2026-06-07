import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { checkAuth } from './store/slices/userSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import Header from './components/features/Header/Header';
import Footer from './components/features/Footer/Footer';
import MainPage from './pages/MainPage';
import GenresPage from './pages/GenresPage';
import GenreMoviesPage from './pages/GenreMoviesPage';
import MoviePage from './pages/MoviePage';
import AccountPage from './pages/AccountPage';
import PrivateRoute from './components/features/PrivateRoute';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  // 1. Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 2. Когда авторизация подтверждена, загружаем избранное
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genres/:genreName" element={<GenreMoviesPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/account" element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;