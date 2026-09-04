-- ========================================================
-- Supabase Schema & Migration: Packages Table
-- Project: ExploreX Smart Tourism Platform
-- ========================================================

-- Create the packages table if it does not exist
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    duration_days INTEGER NOT NULL DEFAULT 1,
    duration_nights INTEGER NOT NULL DEFAULT 0,
    starting_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    discount NUMERIC(10, 2) DEFAULT 0.00,
    price_breakdown JSONB DEFAULT '{}'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    theme TEXT NOT NULL DEFAULT 'heritage',
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    hotels JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    max_group_size INTEGER DEFAULT 12,
    available_dates JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-performance filtering & search
CREATE INDEX IF NOT EXISTS idx_packages_destination_id ON public.packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_packages_theme ON public.packages(theme);
CREATE INDEX IF NOT EXISTS idx_packages_starting_price ON public.packages(starting_price);
CREATE INDEX IF NOT EXISTS idx_packages_is_featured ON public.packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if updating
DROP POLICY IF EXISTS "Public read access for published packages" ON public.packages;
DROP POLICY IF EXISTS "Admin write access for packages" ON public.packages;

-- Policy: Anyone can read published packages
CREATE POLICY "Public read access for published packages"
    ON public.packages
    FOR SELECT
    USING (status = 'published');

-- Policy: Admin / Service role write access for creating, updating, and deleting packages
CREATE POLICY "Admin write access for packages"
    ON public.packages
    FOR ALL
    USING (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') IN ('admin', 'business_owner')
    );
