# ВК Маруся — каталог фильмов

Приложение для просмотра каталога фильмов, поиска по названию и ведения избранного. Проект использует публичное API `cinemaguide.skillbox.cc`, авторизацию по сессии и прокси-эндпойнты Nuxt для получения данных без проблем с CORS.

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
src/
├── api/                    # API-запросы
│   ├── axiosInstance.ts
│   ├── moviesApi.ts
│   ├── genresApi.ts
│   ├── authApi.ts
│   └── favoritesApi.ts
├── app/                    # Redux store, хуки
│   ├── store.ts
│   └── hooks.ts
├── assets/                 # Иконки, изображения
│   └── images/
├── components/             # React-компоненты
│   ├── features/           # Сложные компоненты
│   │   ├── Header/
│   │   ├── AuthModal/
│   │   ├── TrailerModal/
│   │   └── Footer/
│   └── UI/                 # Переиспользуемые UI-компоненты
│       ├── Button/
│       ├── Input/
│       ├── Rating/
│       ├── MovieCard/
│       ├── MovieGrid/
│       ├── MovieHero/
│       └── ...
├── hooks/                  # Кастомные хуки
│   └── useDebounce.ts
├── pages/                  # Страницы приложения
│   ├── MainPage/
│   ├── MoviePage/
│   ├── GenresPage/
│   ├── GenreMoviesPage/
│   └── AccountPage/
├── store/                  # Redux слайсы
│   └── slices/
├── styles/                 # Глобальные стили и переменные
│   ├── global.scss
│   ├── _variables.scss
│   └── _button-base.scss
├── utils/                  # Утилиты
│   └── format.ts
├── test/                   # Тестовые утилиты и настройки
│   ├── setup.ts
│   └── utils.tsx
└── main.tsx

## Основные компоненты
- `MovieHero` – блок с фильмом (случайный или детальный)
- `MovieCard` – карточка фильма
- `MovieGrid` – сетка/лента фильмов
- `HeaderSearch` – поиск с выпадающим списком
- `AuthModal` – модалка авторизации
- `TrailerModal` – модалка с трейлером

## API
Базовый URL: https://cinemaguide.skillbox.cc/


## Лицензия
Проект распространяется под свободной лицензией, если иное не указано в репозитории.
