# LOCK IN Tracker

A personal habit tracker PWA. Dark. Minimal. No excuses.

## Tech Stack

- React 18
- Vite 5
- Supabase (database)
- Plain CSS
- vite-plugin-pwa (service worker + PWA)

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Create the table

Run this SQL in the Supabase SQL Editor:

```sql
create table habit_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  date text not null,
  habits jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);
```

### 3. Row Level Security (optional but recommended)

Since this app has no auth, you can either:

- **Disable RLS** (simplest for personal use):
  ```sql
  alter table habit_history disable row level security;
  ```

- **Or allow all** with a policy:
  ```sql
  alter table habit_history enable row level security;
  create policy "Allow all" on habit_history for all using (true) with check (true);
  ```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase project under **Settings → API**.

---

## Local Installation

```bash
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
# then edit .env with your Supabase credentials
```

---

## Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the build locally:

```bash
npm run preview
```

---

## Add to Home Screen — Android

1. Open the app in Chrome.
2. Tap the **three-dot menu** (top right).
3. Tap **"Add to Home screen"**.
4. Tap **"Add"** in the confirmation dialog.
5. The app will appear on your home screen and open in standalone mode (no browser chrome).

You may also see an **install banner** appear at the bottom of the screen automatically.

---

## Add to Home Screen — iPhone

1. Open the app in **Safari** (must be Safari, not Chrome).
2. Tap the **Share button** (box with arrow pointing up) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top right.
5. The app will appear on your home screen and open fullscreen.

> Note: iOS PWA support requires Safari. The app will not install from Chrome on iPhone.

---

## Vercel Deployment

1. Push your repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Vercel auto-detects Vite.

No extra config needed. SPA routing works out of the box.

---

## GitHub Pages Deployment

GitHub Pages does not support SPA routing natively, but this app has no client-side routing so it works fine.

1. Build the app:
   ```bash
   npm run build
   ```

2. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```

4. Add to `vite.config.js`:
   ```js
   base: "/your-repo-name/",
   ```

5. Deploy:
   ```bash
   npm run build && npm run deploy
   ```

> **Important**: Environment variables (`VITE_SUPABASE_*`) must be baked in at build time. Do not expose secret keys. The Supabase anon key is safe to expose — it is public by design. Protect your data using RLS policies in Supabase.

---

## Troubleshooting

**"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"**  
→ You haven't created a `.env` file. Copy `.env.example` to `.env` and fill in your credentials.

**Data not loading / "Failed to load data"**  
→ Check your Supabase URL and anon key. Check that RLS is disabled or a permissive policy exists. Check your browser console for the exact error.

**Sync failed error after toggling**  
→ Likely a network issue or RLS blocking the upsert. Check Supabase logs under **Logs → API**.

**PWA not installing on iPhone**  
→ Must use Safari. Chrome on iOS does not support PWA installation.

**Service worker not updating after a new deploy**  
→ Hard reload: long-press refresh on mobile, or clear site data in browser settings.

**App shows stale data**  
→ The app loads all history fresh from Supabase on every open. If data looks wrong, check the `habit_history` table directly in Supabase dashboard.
