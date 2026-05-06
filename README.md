# Финансовый дашборд: React + Supabase + Vercel

Это стартовый проект онлайн-дашборда на основе Excel-файла "Финансовый план до Августа.xlsx".

## Что внутри

- React + Vite
- Supabase Auth
- Supabase Postgres
- Row Level Security
- Recharts для графиков
- Современный адаптивный интерфейс
- Быстрый ввод фактических операций
- Редактирование факта
- Импорт стартовых данных из Excel, зашитый в приложение

## 1. Создай Supabase проект

1. Перейди в Supabase.
2. Создай новый проект.
3. Открой SQL Editor.
4. Выполни файл `supabase/schema.sql`.

## 2. Возьми ключи Supabase

В Supabase:
Project Settings -> API

Нужны:
- Project URL
- anon public key

## 3. Запусти локально

```bash
npm install
cp .env.example .env
```

Заполни `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Запуск:

```bash
npm run dev
```

Открой адрес из консоли, обычно:

```bash
http://localhost:5173
```

## 4. Первый вход

1. Нажми "Зарегистрироваться".
2. Создай аккаунт.
3. Если в Supabase включено подтверждение email — подтверди почту.
4. Войди.
5. Нажми "Загрузить стартовые данные".

## 5. Деплой на Vercel

1. Загрузи проект в GitHub.
2. В Vercel выбери "Add New Project".
3. Импортируй репозиторий.
4. Добавь Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Нажми Deploy.

## Важное

`anon public key` можно использовать во фронтенде, потому что доступ к данным защищается RLS-политиками в базе.
Не добавляй `service_role key` во фронтенд или в Vercel-переменные для клиентского приложения.
