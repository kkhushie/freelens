# Supabase SQL Setup and Configuration Guide

To enable live real-time synchronization in Freelens, configure your environment variables and execute the database migrations in your Supabase project dashboard.

---

## 1. Environment Variable Configuration

Create a file named `.env.local` in the root of your project:
```bash
# c:\Projects\freelens\.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```
Replace the values with the actual API keys found in your Supabase project settings under **Project Settings > API**.

Restart your local development server after creating or updating this file:
```bash
npm run dev
```

---

## 2. Database Schema Migrations

Run the following SQL script inside the **SQL Editor** in your Supabase dashboard to create the necessary tables and configure RLS (Row Level Security) policies.

```sql
-- ==========================================
-- 1. Create Projects Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    client TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Completed', 'Pending')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can insert their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = user_id);


-- ==========================================
-- 2. Create Clients Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    revenue NUMERIC DEFAULT 0 NOT NULL,
    projects INTEGER DEFAULT 0 NOT NULL,
    growth NUMERIC DEFAULT 0 NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Users can insert their own clients" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own clients" 
ON public.clients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update/upsert their own clients" 
ON public.clients FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients FOR DELETE 
USING (auth.uid() = user_id);


-- ==========================================
-- 3. Create Goals Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.goals (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    monthly_target NUMERIC DEFAULT 50000 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals
CREATE POLICY "Users can insert their own goals" 
ON public.goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals" 
ON public.goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update/upsert their own goals" 
ON public.goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.goals FOR DELETE 
USING (auth.uid() = user_id);
```

---

## 3. Verifying setup
Once the SQL runs and your environment variables are configured:
- Run the dashboard.
- The indicator badge at the top left should say **Supabase Connected**.
- Database queries will point to your Supabase tables.
- If you see a warning badge about "Tables Missing", make sure the SQL execution was completed successfully.
