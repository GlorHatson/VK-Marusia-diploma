import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/features/Header/Header';
import Footer from './components/features/Footer/Footer';
import MainPage from './pages/MainPage';
import GenresPage from './pages/GenresPage';
import GenreMoviesPage from './pages/GenreMoviesPage';
import MoviePage from './pages/MoviePage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genres/:genreName" element={<GenreMoviesPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;