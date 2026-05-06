-- FinPlan v3 migration: editable category catalog.
-- Run this once in Supabase SQL Editor before deploying the updated React app.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  name text not null check (length(trim(name)) > 0 and length(name) <= 80),
  is_default boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, type, name)
);

create index if not exists finance_categories_user_type_idx
  on public.finance_categories(user_id, type, sort_order, name);

drop trigger if exists set_finance_categories_updated_at on public.finance_categories;
create trigger set_finance_categories_updated_at
before update on public.finance_categories
for each row execute function public.set_updated_at();

alter table public.finance_categories enable row level security;

drop policy if exists "Users can read own finance categories" on public.finance_categories;
create policy "Users can read own finance categories"
on public.finance_categories
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance categories" on public.finance_categories;
create policy "Users can insert own finance categories"
on public.finance_categories
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance categories" on public.finance_categories;
create policy "Users can update own finance categories"
on public.finance_categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own finance categories" on public.finance_categories;
create policy "Users can delete own finance categories"
on public.finance_categories
for delete
to authenticated
using (auth.uid() = user_id);

-- Seed default categories for all existing users.
insert into public.finance_categories (user_id, type, name, is_default, sort_order)
select u.id, defaults.type, defaults.name, true, defaults.sort_order
from auth.users u
cross join (values
  ('income', 'Зарплата', 10),
  ('income', 'Проекты', 20),
  ('income', 'Возврат долга', 30),
  ('income', 'Подарки', 40),
  ('income', 'Прочее', 50),
  ('expense', 'Еда и быт', 10),
  ('expense', 'Авто', 20),
  ('expense', 'Долги и кредиты', 30),
  ('expense', 'Квартира', 40),
  ('expense', 'Развлечения', 50),
  ('expense', 'Одежда и красота', 60),
  ('expense', 'Налоги', 70),
  ('expense', 'Подарки', 80),
  ('expense', 'Прочее', 90)
) as defaults(type, name, sort_order)
on conflict (user_id, type, name) do nothing;

-- Preserve categories already used in transaction history.
insert into public.finance_categories (user_id, type, name, is_default, sort_order)
select distinct user_id, type, category, false, 200
from public.finance_transactions
where category is not null and length(trim(category)) > 0
on conflict (user_id, type, name) do nothing;

-- Preserve expense categories already used in budgets.
insert into public.finance_categories (user_id, type, name, is_default, sort_order)
select distinct user_id, 'expense', category, false, 200
from public.finance_budgets
where category is not null and length(trim(category)) > 0
on conflict (user_id, type, name) do nothing;
