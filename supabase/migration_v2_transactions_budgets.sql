-- FinPlan v2 migration: operations history, categories, monthly budgets.
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

create table if not exists public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount >= 0),
  category text not null default 'Прочее',
  comment text not null default '',
  source text not null default 'manual',
  source_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, source_key)
);

create index if not exists finance_transactions_user_day_idx
  on public.finance_transactions(user_id, day desc);

create index if not exists finance_transactions_user_category_idx
  on public.finance_transactions(user_id, category);

create table if not exists public.finance_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  category text not null,
  limit_amount numeric(14,2) not null default 0 check (limit_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, month_start, category)
);

create index if not exists finance_budgets_user_month_idx
  on public.finance_budgets(user_id, month_start);

drop trigger if exists set_finance_transactions_updated_at on public.finance_transactions;
create trigger set_finance_transactions_updated_at
before update on public.finance_transactions
for each row execute function public.set_updated_at();

drop trigger if exists set_finance_budgets_updated_at on public.finance_budgets;
create trigger set_finance_budgets_updated_at
before update on public.finance_budgets
for each row execute function public.set_updated_at();

alter table public.finance_transactions enable row level security;
alter table public.finance_budgets enable row level security;

drop policy if exists "Users can read own finance transactions" on public.finance_transactions;
create policy "Users can read own finance transactions"
on public.finance_transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance transactions" on public.finance_transactions;
create policy "Users can insert own finance transactions"
on public.finance_transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance transactions" on public.finance_transactions;
create policy "Users can update own finance transactions"
on public.finance_transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own finance transactions" on public.finance_transactions;
create policy "Users can delete own finance transactions"
on public.finance_transactions
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own finance budgets" on public.finance_budgets;
create policy "Users can read own finance budgets"
on public.finance_budgets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance budgets" on public.finance_budgets;
create policy "Users can insert own finance budgets"
on public.finance_budgets
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance budgets" on public.finance_budgets;
create policy "Users can update own finance budgets"
on public.finance_budgets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own finance budgets" on public.finance_budgets;
create policy "Users can delete own finance budgets"
on public.finance_budgets
for delete
to authenticated
using (auth.uid() = user_id);

-- One-time migration of old aggregated fact values into transaction history.
-- Safe to run repeatedly: source_key prevents duplicates.
insert into public.finance_transactions (user_id, day, type, amount, category, comment, source, source_key)
select
  user_id,
  day,
  'income',
  income_fact,
  case
    when lower(income_fact_comment) similar to '%(зп|зарплат|проф|настя)%' then 'Зарплата'
    when lower(income_fact_comment) similar to '%(4 вида|сайт|оплат)%' then 'Проекты'
    when lower(income_fact_comment) similar to '%(долг|вернул|возврат)%' then 'Возврат долга'
    else 'Прочее'
  end,
  income_fact_comment,
  'legacy',
  'legacy-' || id::text || '-income'
from public.finance_days
where income_fact > 0
on conflict (user_id, source_key) do nothing;

insert into public.finance_transactions (user_id, day, type, amount, category, comment, source, source_key)
select
  user_id,
  day,
  'expense',
  expense_fact,
  case
    when lower(expense_fact_comment) similar to '%(еда|магазин|обед|закуп|сиба|снюс|компы)%' then 'Еда и быт'
    when lower(expense_fact_comment) similar to '%(бензин|ауди|ремонт|учет|мойка|мазда|машин)%' then 'Авто'
    when lower(expense_fact_comment) similar to '%(кредит|кредитк|долг|телефон|родител|яна)%' then 'Долги и кредиты'
    when lower(expense_fact_comment) similar to '%(кв|квартир|коммун)%' then 'Квартира'
    when lower(expense_fact_comment) similar to '%(развлеч|бильярд|набережн|погулял|димос)%' then 'Развлечения'
    when lower(expense_fact_comment) similar to '%(маник|педик|одежд|карман)%' then 'Одежда и красота'
    when lower(expense_fact_comment) similar to '%(налог|фонд)%' then 'Налоги'
    when lower(expense_fact_comment) similar to '%(др|подар)%' then 'Подарки'
    else 'Прочее'
  end,
  expense_fact_comment,
  'legacy',
  'legacy-' || id::text || '-expense'
from public.finance_days
where expense_fact > 0
on conflict (user_id, source_key) do nothing;
