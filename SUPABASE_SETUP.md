# Supabase CMS setup

The website uses the existing CMS interface. Its complete editable document lives in `site_settings.content`; `site_services` and `site_gallery_images` are ordered projections maintained by the database trigger. This keeps all existing fields, additions, removals, and reordering in one atomic save. Public pages and the editor both read the same site-scoped record.

## 1. Database and bucket

The migrations in `supabase/migrations/` have been applied to project `lqanhwajrylqxuyfaudl`. They create the tables, RLS policies, `site-assets` public bucket, and site row. The bucket permits public image reads; anonymous clients cannot upload or edit CMS content. Public forms may insert bounded enquiries and newsletter subscriptions, while their records remain private.

The existing `data/cms-data.json` content and all 75 local image references have been imported. Supabase Storage holds 73 unique objects because two image references share identical file contents. The CMS record now contains public Supabase Storage URLs.

## 2. Environment

Set these in `.env.local` and in the Vercel project environment. Restart Next.js after local changes.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL, `https://lqanhwajrylqxuyfaudl.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key from Supabase Settings → API Keys |
| `NEXT_PUBLIC_SITE_ID` | `vs-maintenance-services` |
| `SUPABASE_SECRET_KEY` | Server-only secret key from Supabase Settings → API Keys |
| `CMS_EDITOR_SECRET` | Strong random server-only editor secret, delivered as a secure HttpOnly `cms_editor` cookie by a trusted access gateway after owner verification |

The secret key and editor secret must never use the `NEXT_PUBLIC_` prefix. Do not place either in source control. The app has no login screen. A trusted access gateway must verify the owner, protect `/admin`, and set `cms_editor` as Secure, HttpOnly, SameSite=Lax with the exact `CMS_EDITOR_SECRET` value. Without this gateway and secret, production editing and uploads return HTTP 403. Same-origin requests alone do not provide authorisation. Local development without a secret allows writes only from `localhost`.

## 3. Import existing content and images

The import has already been completed. For a future fresh site/project, run:

```powershell
node --env-file=.env.local scripts/import-cms-to-supabase.mjs
```

The script uploads existing `/uploads/` images to `site-assets` under the configured site ID and rewrites their references in the imported document. It does not delete old images. Rerunning overwrites later database edits with the local JSON snapshot.

## 4. Verify

The five public routes and `/api/cms` render live database content. A temporary database text change appeared in `/api/cms` and was restored. Public logo delivery, all 17 service and 52 gallery projections, anonymous read-only CMS access, denied anonymous uploads, denied private lead reads, and server-only upload/delete were verified. The production enquiry and newsletter APIs both accepted test submissions, and those records were removed afterward. The Supabase security advisor reported no findings. `npm run build`, TypeScript, and ESLint passed.

The owner chose to keep production editing locked for now. `/admin`, CMS saves and CMS uploads return 403 until a trusted owner access gateway and `CMS_EDITOR_SECRET` are configured. End-to-end editor save/upload tests remain pending for that reason.

If Supabase is unavailable, public rendering uses the bundled existing content without modifying the database. A failed save returns an error and does not overwrite the editor's unsaved values. Production enquiries and newsletter subscriptions write to Supabase using their narrow public insert policies; CMS edits and uploads require the server-only key and editor gateway.
