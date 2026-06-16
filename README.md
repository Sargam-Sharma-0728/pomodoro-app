# 🍅 Pomodoro — Deep Work Timer

A beautiful, minimal Pomodoro timer with task logging and AI-powered productivity insights.

**Stack:** Next.js 14 · Tailwind CSS · Supabase · Claude AI · Vercel

---

## Features

- 🍅 Pomodoro timer with work / short break / long break modes
- ✅ Task input before each session
- 📋 Auto task log saved to database after every session
- 📊 Daily stats (total focus time, session count)
- ✦ AI insights powered by Claude — analyzes your day and gives productivity feedback
- 🎵 Subtle completion sound
- 🌙 Dark mode, minimal UI

---

## Setup Guide (Step by Step)

### Step 1 — Clone & Install

```bash
git clone <your-repo>
cd pomodoro-app
npm install
```

---

### Step 2 — Set up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** → give it a name → set a password → create
3. Wait for it to spin up (~1 min)
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy and paste everything from `supabase-schema.sql` → click **Run**
7. Go to **Project Settings → API**
8. Copy your **Project URL** and **anon/public key**

---

### Step 3 — Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (you only see it once!)

---

### Step 4 — Create your .env.local file

Create a file called `.env.local` in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Step 6 — Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add the same 3 variables from your `.env.local`
5. Click **Deploy** 🚀

That's it — your site is live!

---

## Project Structure

```
pomodoro-app/
├── app/
│   ├── api/
│   │   ├── sessions/route.ts      ← Save & fetch sessions from Supabase
│   │   └── ai-summary/route.ts    ← Generate AI insights via Claude
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   ← Main timer page
├── components/
│   ├── TimerRing.tsx              ← SVG progress ring
│   ├── TaskLog.tsx                ← Session history list
│   └── AISummary.tsx             ← AI insights panel
├── lib/
│   └── supabase.ts               ← Supabase client
├── supabase-schema.sql           ← Run this in Supabase
└── .env.local.example            ← Copy this to .env.local
```

---

## How it Works

1. User enters what they're working on
2. Timer runs for 25 minutes
3. On completion → session is saved to Supabase via API route
4. Task log updates in real-time
5. User clicks "Analyze day" → Claude reads all sessions → returns smart insights

---

## Tech Choices

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js 14 + React | App Router, easy Vercel deploy |
| Styling | Tailwind CSS | Fast, utility-first dark mode |
| Database | Supabase (PostgreSQL) | Free, real-time, great SDK |
| AI | Anthropic Claude | Best for nuanced productivity insights |
| Deploy | Vercel | Zero-config, git-connected |
