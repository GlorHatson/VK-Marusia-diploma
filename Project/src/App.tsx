import { useEffect, useState } from 'react';
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
import Loader from './components/UI/Loader/Loader';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

if (isInitialLoad) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'linear-gradient(178.73deg, rgba(39, 135, 245, 0.18) -17.53%, rgba(163, 147, 245, 0.18) 131.74%)',
        zIndex: 9999,
      }}
    >
      <Loader size={200} />
    </div>
  );
}

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