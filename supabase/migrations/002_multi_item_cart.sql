-- Run this in the Supabase SQL editor. Migrates orders from a single
-- product_id/product_name/amount-per-order model to a multi-item cart:
-- amount becomes the order TOTAL, and items holds the line items.
alter table public.orders add column if not exists items jsonb;

update public.orders
set items = jsonb_build_array(
  jsonb_build_object(
    'productId', product_id,
    'productName', product_name,
    'unitPrice', amount,
    'quantity', 1,
    'lineTotal', amount
  )
)
where items is null;

alter table public.orders alter column items set not null;
alter table public.orders drop column if exists product_id;
alter table public.orders drop column if exists product_name;
