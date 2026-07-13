# ВК Маруся — каталог фильмов

Приложение для просмотра каталога фильмов, поиска по названию и ведения избранного. Проект использует публичное API `cinemaguide.skillbox.cc` с авторизацией по сессии.

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
