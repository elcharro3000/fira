-- FIRA member dashboard schema
-- Run this in Supabase SQL Editor after creating the project.

create table if not exists public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  class_credits_remaining integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_purchases (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(id) on delete cascade,
  stripe_session_id text unique,
  package_id text not null,
  package_name text not null,
  classes_added integer not null,
  amount_cents integer not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.member_reservations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(id) on delete cascade,
  service_id text not null,
  service_name text not null,
  slot_id text not null,
  starts_at timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  unique(member_id, slot_id)
);

alter table public.member_profiles enable row level security;
alter table public.member_purchases enable row level security;
alter table public.member_reservations enable row level security;

create policy "members can read own profile"
  on public.member_profiles for select
  using (auth.uid() = id);

create policy "members can update own profile"
  on public.member_profiles for update
  using (auth.uid() = id);

create policy "members can read own purchases"
  on public.member_purchases for select
  using (auth.uid() = member_id);

create policy "members can read own reservations"
  on public.member_reservations for select
  using (auth.uid() = member_id);

create policy "members can create own reservations"
  on public.member_reservations for insert
  with check (auth.uid() = member_id);

create index if not exists member_reservations_slot_idx
  on public.member_reservations(slot_id)
  where status = 'confirmed';

create index if not exists member_reservations_member_starts_idx
  on public.member_reservations(member_id, starts_at);
