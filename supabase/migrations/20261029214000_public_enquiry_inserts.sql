-- Public forms can only add bounded enquiries/subscriptions for an existing published site.
-- SELECT, UPDATE and DELETE remain unavailable to anonymous clients.
alter table public.site_leads add constraint site_leads_public_payload_check check (
  length(coalesce(payload->>'name','')) between 1 and 120 and
  length(coalesce(payload->>'email','')) between 3 and 254 and
  length(coalesce(payload->>'phone','')) <= 40 and
  length(coalesce(payload->>'service','')) <= 120 and
  length(coalesce(payload->>'poolDetails','')) <= 2000 and
  length(coalesce(payload->>'message','')) <= 5000
);
alter table public.site_subscribers add constraint site_subscribers_email_check check (length(email) between 3 and 254 and email like '%@%');

grant insert on public.site_leads, public.site_subscribers to anon, authenticated;
create policy "Published sites may receive enquiries" on public.site_leads for insert to anon, authenticated
with check (exists (select 1 from public.site_settings where site_id = site_leads.site_id and content <> '{}'::jsonb));
create policy "Published sites may receive subscriptions" on public.site_subscribers for insert to anon, authenticated
with check (exists (select 1 from public.site_settings where site_id = site_subscribers.site_id and content <> '{}'::jsonb));
