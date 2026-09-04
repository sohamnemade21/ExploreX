-- ========================================================
-- Supabase Schema & Migration: Admin Audit Logs & Strict RLS
-- Project: ExploreX Smart Tourism Platform
-- ========================================================

-- 1. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL, -- 'BOOKING_CANCELLED' | 'BOOKING_STATUS_UPDATED' | 'EMAIL_RESENT' | 'REVIEW_DELETED' | 'DATA_EXPORTED' | 'DESTINATION_CREATED' | 'DESTINATION_DELETED' | 'USER_ROLE_UPDATED' | 'DATABASE_RESET'
    target_type TEXT NOT NULL, -- 'booking' | 'user' | 'review' | 'destination' | 'report' | 'email' | 'system'
    target_id TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_target ON public.admin_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.admin_audit_logs(created_at DESC);

-- Enable RLS on admin_audit_logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only verified admins or service_role can view audit logs
DROP POLICY IF EXISTS "Admin read access for audit_logs" ON public.admin_audit_logs;
CREATE POLICY "Admin read access for audit_logs"
    ON public.admin_audit_logs FOR SELECT
    USING (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'email') = 'explorexsih0426@gmail.com'
    );

-- Only verified admins or service_role can insert audit logs
DROP POLICY IF EXISTS "Admin write access for audit_logs" ON public.admin_audit_logs;
CREATE POLICY "Admin write access for audit_logs"
    ON public.admin_audit_logs FOR INSERT
    WITH CHECK (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'email') = 'explorexsih0426@gmail.com'
    );

-- 2. User Roles Table (Server-side authoritative role mapping)
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin' | 'user'
    granted_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read own role" ON public.user_roles;
CREATE POLICY "Public read own role"
    ON public.user_roles FOR SELECT
    USING (
        auth.uid()::text = user_id
        OR auth.role() = 'service_role'
        OR (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'email') = 'explorexsih0426@gmail.com'
    );

DROP POLICY IF EXISTS "Admin write user roles" ON public.user_roles;
CREATE POLICY "Admin write user roles"
    ON public.user_roles FOR ALL
    USING (
        auth.role() = 'service_role'
        OR (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'email') = 'explorexsih0426@gmail.com'
    );

-- Pre-seed root administrators
INSERT INTO public.user_roles (user_id, email, role, granted_by)
VALUES 
    ('admin-root-01', 'explorexsih0426@gmail.com', 'admin', 'system_init')
ON CONFLICT (user_id) DO NOTHING;
