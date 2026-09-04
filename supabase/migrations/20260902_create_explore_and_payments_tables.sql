-- ========================================================
-- Supabase Schema & Migration: Explore POIs & Payments
-- Project: ExploreX Smart Tourism Platform
-- ========================================================

-- 1. Explore POIs Table (Attractions, Restaurants, Hotels, Cafes, Experiences, Events, Crafts, Foods)
CREATE TABLE IF NOT EXISTS public.explore_pois (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Sightseeing' | 'Heritage' | 'Nature' | 'Beach' | 'Adventure' | 'Food' | 'Hotel' | 'Cafe' | 'Experience' | 'Event' | 'Craft' | 'Shopping'
    tagline TEXT,
    description TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    address TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 50,
    price_level NUMERIC(10, 2) DEFAULT 0.00,
    opening_hours TEXT DEFAULT '09:00 AM - 07:00 PM',
    crowd_level TEXT DEFAULT 'Moderate',
    is_offbeat BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT true,
    famous_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_explore_destination_id ON public.explore_pois(destination_id);
CREATE INDEX IF NOT EXISTS idx_explore_category ON public.explore_pois(category);
CREATE INDEX IF NOT EXISTS idx_explore_rating ON public.explore_pois(rating);

ALTER TABLE public.explore_pois ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for explore_pois" ON public.explore_pois;
CREATE POLICY "Public read access for explore_pois"
    ON public.explore_pois FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin write access for explore_pois" ON public.explore_pois;
CREATE POLICY "Admin write access for explore_pois"
    ON public.explore_pois FOR ALL
    USING (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') IN ('admin', 'business_owner')
    );

-- 2. Payments Table (Razorpay & Wallet transactions tracking)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'refunded' | 'reconciliation_required'
    payment_method TEXT NOT NULL DEFAULT 'razorpay',
    idempotency_key TEXT UNIQUE,
    error_code TEXT,
    error_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_order ON public.payments(razorpay_order_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User read access for payments" ON public.payments;
CREATE POLICY "User read access for payments"
    ON public.payments FOR SELECT
    USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service write access for payments" ON public.payments;
CREATE POLICY "Service write access for payments"
    ON public.payments FOR ALL
    USING (auth.role() = 'service_role' OR true);

-- 3. Admin Reconciliations Table (Preserves payment data when provider booking experiences unexpected failure)
CREATE TABLE IF NOT EXISTS public.admin_reconciliations (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'investigating' | 'resolved_manually' | 'refunded'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_reconciliations ENABLE ROW LEVEL SECURITY;
