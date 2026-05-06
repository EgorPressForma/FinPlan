-- Supabase SQL schema for React financial dashboard
-- Run this in Supabase Dashboard -> SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.finance_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Финансовый план',
  start_date date not null default current_date,
  start_balance_fact numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.finance_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  income_plan numeric(14,2) not null default 0,
  income_plan_comment text not null default '',
  income_fact numeric(14,2) not null default 0,
  income_fact_comment text not null default '',
  expense_plan numeric(14,2) not null default 0,
  expense_plan_comment text not null default '',
  expense_fact numeric(14,2) not null default 0,
  expense_fact_comment text not null default '',
  balance_plan numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, day)
);

create index if not exists finance_days_user_day_idx
  on public.finance_days(user_id, day);

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

drop trigger if exists set_finance_settings_updated_at on public.finance_settings;
create trigger set_finance_settings_updated_at
before update on public.finance_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_finance_days_updated_at on public.finance_days;
create trigger set_finance_days_updated_at
before update on public.finance_days
for each row execute function public.set_updated_at();

alter table public.finance_settings enable row level security;
alter table public.finance_days enable row level security;

drop policy if exists "Users can read own finance settings" on public.finance_settings;
create policy "Users can read own finance settings"
on public.finance_settings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance settings" on public.finance_settings;
create policy "Users can insert own finance settings"
on public.finance_settings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance settings" on public.finance_settings;
create policy "Users can update own finance settings"
on public.finance_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own finance settings" on public.finance_settings;
create policy "Users can delete own finance settings"
on public.finance_settings
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own finance days" on public.finance_days;
create policy "Users can read own finance days"
on public.finance_days
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance days" on public.finance_days;
create policy "Users can insert own finance days"
on public.finance_days
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance days" on public.finance_days;
create policy "Users can update own finance days"
on public.finance_days
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own finance days" on public.finance_days;
create policy "Users can delete own finance days"
on public.finance_days
for delete
to authenticated
using (auth.uid() = user_id);
