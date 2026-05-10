# Chad CMS - React + Supabase

Modern React-based Chad Management System hosted on Vercel.

## Quick Start

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run `supabase-schema.sql`
3. Copy your project URL and anon key

### 2. Set Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Or set in Vercel dashboard when deploying.

### 3. Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit - Chad CMS React"
git remote add origin https://github.com/ChadAssistantBot/chad-cms.git
git push -u origin main

# Then deploy on Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo: ChadAssistantBot/chad-cms
# 3. Add environment variables
# 4. Deploy!
```

### 4. Local Development

```bash
npm install
npm run dev
```

## Features

- ✅ **Dashboard** - Overview with quick stats
- ✅ **Kanban Board** - Task management (coming soon)
- ✅ **Finances** - Revenue/expense tracking
- ✅ **Ventures** - 5 business opportunities with execution plans
- ✅ **Agents** - AI org chart

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **Hosting:** Vercel (Free tier)
- **Auth:** Simple localStorage (upgrade to Supabase Auth later)

## Login Credentials

- Username: `boss`
- Password: `PCz8l17qmKUKP8fy`

(Update in `src/pages/Login.jsx` for production!)
