-- VS Maintenance Services CMS. The content JSON is the single editable source of truth.
-- Service and gallery tables are queryable projections maintained by the trigger below.
create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_id text not null unique check (site_id ~ '^[a-z0-9-]+$'),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_services (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.site_settings(site_id) on delete cascade,
  item_key text not null,
  title text not null,
  description text not null default '',
  image_url text not null default '',
  after_image_url text not null default '',
  included jsonb not null default '[]'::jsonb,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, item_key),
  unique (site_id, display_order)
);
create index if not exists site_services_order_idx on public.site_services(site_id, display_order);

create table if not exists public.site_gallery_images (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.site_settings(site_id) on delete cascade,
  item_key text not null,
  title text not null default '',
  image_url text not null default '',
  alt_text text not null default '',
  category text not null default '',
  location text not null default '',
  description text not null default '',
  layout_type text,
  slide_group integer,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, item_key),
  unique (site_id, display_order)
);
create index if not exists site_gallery_order_idx on public.site_gallery_images(site_id, display_order);

create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.site_settings(site_id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now()
);
create index if not exists site_leads_recent_idx on public.site_leads(site_id, created_at desc);

create table if not exists public.site_subscribers (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.site_settings(site_id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  unique (site_id, email)
);

create or replace function public.sync_site_items() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.site_services where site_id = new.site_id;
  insert into public.site_services(site_id,item_key,title,description,image_url,after_image_url,included,display_order)
  select new.site_id,
    coalesce(item->>'id', 'service-' || ordinality::text),
    coalesce(item->>'title',''), coalesce(item->>'description',''),
    coalesce(item->>'image',''), coalesce(item->>'afterImage',''),
    case when jsonb_typeof(item->'included') = 'array' then item->'included' else '[]'::jsonb end,
    (ordinality - 1)::integer
  from jsonb_array_elements(case when jsonb_typeof(new.content #> '{services,items}') = 'array' then new.content #> '{services,items}' else '[]'::jsonb end)
  with ordinality as source(item, ordinality);

  delete from public.site_gallery_images where site_id = new.site_id;
  insert into public.site_gallery_images(site_id,item_key,title,image_url,alt_text,category,location,description,layout_type,slide_group,display_order)
  select new.site_id,
    coalesce(item->>'id', 'gallery-' || ordinality::text),
    coalesce(item->>'title',''), coalesce(item->>'imageUrl',''),
    coalesce(item->>'title',''), coalesce(item->>'category',''),
    coalesce(item->>'location',''), coalesce(item->>'description',''),
    item->>'layoutType', nullif(item->>'slideGroup','')::integer,
    (ordinality - 1)::integer
  from jsonb_array_elements(case when jsonb_typeof(new.content #> '{gallery,items}') = 'array' then new.content #> '{gallery,items}' else '[]'::jsonb end)
  with ordinality as source(item, ordinality);
  return new;
end;
$$;
drop trigger if exists site_settings_sync_items on public.site_settings;
create trigger site_settings_sync_items after insert or update of content on public.site_settings
for each row execute function public.sync_site_items();

alter table public.site_settings enable row level security;
alter table public.site_services enable row level security;
alter table public.site_gallery_images enable row level security;
alter table public.site_leads enable row level security;
alter table public.site_subscribers enable row level security;

revoke all on public.site_settings, public.site_services, public.site_gallery_images, public.site_leads, public.site_subscribers from anon, authenticated;
grant all on public.site_settings, public.site_services, public.site_gallery_images, public.site_leads, public.site_subscribers to service_role;
grant select on public.site_settings, public.site_services, public.site_gallery_images to anon, authenticated;
create policy "Public may read published site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Public may read published services" on public.site_services for select to anon, authenticated using (true);
create policy "Public may read published gallery" on public.site_gallery_images for select to anon, authenticated using (true);
-- No client-side write policies. Server-only secret/service role is used after editor access check.

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('site-assets','site-assets',true,5242880,array['image/png','image/jpeg','image/webp','image/avif','image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
-- Public bucket serves published images. No anon/authenticated upload, update or delete policy.
-- Restrictive policies also block accidental broad storage policies already present in the project.
create policy "site-assets deny client inserts" on storage.objects as restrictive for insert to anon, authenticated
with check (bucket_id <> 'site-assets');
create policy "site-assets deny client updates" on storage.objects as restrictive for update to anon, authenticated
using (bucket_id <> 'site-assets') with check (bucket_id <> 'site-assets');
create policy "site-assets deny client deletes" on storage.objects as restrictive for delete to anon, authenticated
using (bucket_id <> 'site-assets');

insert into public.site_settings(site_id, content)
values ('vs-maintenance-services', '{}'::jsonb)
on conflict (site_id) do nothing;
