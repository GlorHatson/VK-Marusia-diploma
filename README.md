# ВК Маруся — каталог фильмов
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

Приложение для просмотра каталога фильмов, поиска по названию и ведения избранного. Проект использует публичное API `cinemaguide.skillbox.cc` с авторизацией по сессии.
<p align="start">
  <a href="https://glorhatson.github.io/VK-Marusia-diploma/">
    <img src="https://img.shields.io/badge/Посмотреть_демо-Ссылка-4285F4?style=for-the-badge" alt="Демо">
  </a>
</p>

## Функциональность
- Главная страница с топ-10 фильмов и случайным фильмом
- Поиск фильмов с дебаунсом и мобильной адаптацией
- Страница жанров с постерами
- Страница фильма с трейлером (YouTube Iframe API)
- Авторизация (регистрация, вход, выход)
- Избранное (добавление/удаление)
- Личный кабинет с настройками и списком избранного
- Адаптивная вёрстка (десктоп, планшеты, мобильные)

## Технологии
- **React 18** + **TypeScript**
- **Redux Toolkit** + **React-Redux**
- **React Router v6**
- **Vite** (сборка)
- **Vitest** + **Testing Library** (тесты)
- **SCSS Modules** (стилизация)
- **Axios** (запросы к API)

## Установка и запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите режим разработки:
   ```bash
   npm run dev
   ```
3. Сборка и предпросмотр продакшн‑версии:
   ```bash
   npm run build
   npm run preview
   ```
4. Тестирование:
   ```bash
   npm test
   ```   

## Структура проекта

**Основные папки:**

- `src/api/` – API-запросы (axiosInstance, moviesApi, genresApi, authApi, favoritesApi)
- `src/app/` – Redux store и хуки
- `src/assets/` – иконки, изображения
- `src/components/features/` – сложные компоненты (Header, AuthModal, TrailerModal, Footer)
- `src/components/UI/` – переиспользуемые UI-компоненты (Button, Input, Rating, MovieCard и др.)
- `src/hooks/` – кастомные хуки (useDebounce)
- `src/pages/` – страницы приложения (MainPage, MoviePage, GenresPage, GenreMoviesPage, AccountPage)
- `src/store/slices/` – Redux слайсы
- `src/styles/` – глобальные стили и переменные
- `src/utils/` – утилиты (format)
- `src/test/` – тестовые утилиты и настройки
- `src/main.tsx` – точка входа

## Основные компоненты
- `MovieHero` – блок с фильмом (случайный или детальный)
- `MovieCard` – карточка фильма
- `MovieGrid` – сетка/лента фильмов
- `HeaderSearch` – поиск с выпадающим списком
- `AuthModal` – модальное окно авторизации
- `TrailerModal` – модальное окно с трейлером

## API
Базовый URL: https://cinemaguide.skillbox.cc/
Все запросы отправляются напрямую к API, авторизация поддерживается через сессионные cookie.

## Лицензия
Проект распространяется под свободной лицензией, если иное не указано в репозитории.
