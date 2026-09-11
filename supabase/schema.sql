-- Run this in the Supabase SQL editor (or via the CLI) before going live.
-- If you already ran an earlier version of this file, run
-- supabase/migrations/002_multi_item_cart.sql instead — this file is only
-- for a brand-new database.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  paypal_order_id text not null unique,
  paypal_capture_id text not null unique,
  items jsonb not null,
  amount numeric(10, 2) not null,
  currency text not null,
  customer_name text not null,
  customer_email text not null,
  shipping_line1 text not null,
  shipping_line2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_postal_code text not null,
  shipping_country text not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_email_idx on public.orders (customer_email);

-- Row Level Security: no client-side access. All reads/writes to this
-- table happen through the /api serverless functions using the Supabase
-- service role key, which bypasses RLS entirely.
alter table public.orders enable row level security;
