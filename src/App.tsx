import { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { checkAuth } from './store/slices/userSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import Header from './components/features/Header/Header';
import Footer from './components/features/Footer/Footer';
import PrivateRoute from './components/features/PrivateRoute';
import Loader from './components/UI/Loader/Loader';
import ErrorBoundary from './components/features/ErrorBoundary/ErrorBoundary';

// Ленивая загрузка страниц
const MainPage = lazy(() => import('./pages/MainPage'));
const GenresPage = lazy(() => import('./pages/GenresPage'));
const GenreMoviesPage = lazy(() => import('./pages/GenreMoviesPage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

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
          background: 'linear-gradient(178.73deg, rgba(39, 135, 245, 0.18) -17.53%, rgba(163, 147, 245, 0.18) 131.74%)',
          zIndex: 9999,
        }}
      >
        <Loader size={200} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Header />
        <main>
          <Suspense fallback={<Loader size={200} message="Загрузка страницы..." />}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/genres/:genreName" element={<GenreMoviesPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;