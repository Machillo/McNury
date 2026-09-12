-- Esquema inicial de referencia. Se aplicará cuando conectemos el proyecto remoto.
create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  is_accepting_orders boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  price_crc integer not null check (price_crc >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  unit text not null,
  quantity numeric(12,3) not null default 0,
  minimum_quantity numeric(12,3) not null default 0,
  average_unit_cost_crc numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  business_id uuid not null references public.businesses(id),
  customer_name text not null,
  customer_phone text not null,
  source text not null check (source in ('app','local','whatsapp','phone')),
  status text not null default 'new' check (status in ('new','preparing','ready','completed','cancelled')),
  payment_method text not null,
  payment_status text not null default 'pending',
  total_crc integer not null check (total_crc >= 0),
  pickup_time timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id),
  category text not null,
  description text not null,
  amount_crc integer not null check (amount_crc >= 0),
  expense_date date not null default current_date,
  created_at timestamptz not null default now()
);
