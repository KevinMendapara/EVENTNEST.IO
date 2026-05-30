-- =========================================================================
-- EventNest PostgreSQL Database Schema & RLS Policies (Supabase Compatible)
-- =========================================================================
-- Note: Supabase runs on PostgreSQL. This script provides the exact schemas
-- and Row Level Security (RLS) policies needed for the application to function.
--
-- How to apply:
-- 1. Copy the contents of this file.
-- 2. Go to your Supabase Dashboard -> SQL Editor.
-- 3. Click "New Query", paste the SQL below, and click "Run".
-- =========================================================================

-- -------------------------------------------------------------
-- 1. CREATE USERS TABLE & RLS POLICIES
-- -------------------------------------------------------------

-- Drop table if it exists (warning: deletes existing user data)
-- DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    age INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous selects" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous updates" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON public.users;

-- Create Policies to allow anonymous public access (via Anon Key)
CREATE POLICY "Allow anonymous inserts" ON public.users 
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous selects" ON public.users 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous updates" ON public.users 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous deletes" ON public.users 
    FOR DELETE TO anon USING (true);


-- -------------------------------------------------------------
-- 2. CREATE ORDERS TABLE & RLS POLICIES
-- -------------------------------------------------------------

-- Drop table if it exists (warning: deletes existing order data)
-- DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY, -- Custom generated format (e.g. MOV-BK-20260530-xxxx)
    "user" VARCHAR(100) NOT NULL, -- Email address or Guest
    title VARCHAR(100),
    category VARCHAR(50),
    image TEXT,
    seats TEXT,
    amount NUMERIC NOT NULL,
    date VARCHAR(100) NOT NULL,
    "eventDate" VARCHAR(100),
    "eventTime" VARCHAR(100),
    venue VARCHAR(255),
    coupon VARCHAR(50),
    addons JSONB,
    theatre VARCHAR(255),
    screen VARCHAR(100),
    time VARCHAR(100),
    format VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous order inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous order selects" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous order updates" ON public.orders;

-- Create Policies to allow anonymous public access (via Anon Key)
CREATE POLICY "Allow anonymous order inserts" ON public.orders 
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous order selects" ON public.orders 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous order updates" ON public.orders 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);