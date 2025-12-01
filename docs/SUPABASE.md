-- ============================================================================
-- ADD-ON: CERTEVAL (HYBRID: MEMBERS & GUESTS)
-- ============================================================================

-- 1. CREATE EVENTS TABLE (Unchanged)
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    event_date DATE NOT NULL,
    pulse_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE EVENT CLAIMS TABLE (Modified for Guests)
CREATE TABLE public.event_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    
    -- OPTION A: If they are a Member
    awscc_id TEXT REFERENCES public.sbd_members(awsccpup_id) ON DELETE CASCADE, 
    
    -- OPTION B: If they are a Non-Member (Guest)
    guest_name TEXT, 
    
    proof_url TEXT NOT NULL,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CONSTRAINT: You must be EITHER a member OR a guest, not both (and not neither).
    CONSTRAINT check_identity CHECK (
        (awscc_id IS NOT NULL AND guest_name IS NULL) OR 
        (awscc_id IS NULL AND guest_name IS NOT NULL)
    ),

    -- Prevent duplicates:
    -- A member cannot claim the same event twice.
    -- A guest with the EXACT same name cannot claim the same event twice.
    UNIQUE NULLS NOT DISTINCT (event_id, awscc_id, guest_name)
);

-- 3. ENABLE RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_claims ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view events
CREATE POLICY "Everyone can view active events" ON public.events FOR SELECT USING (is_active = true);

-- Allow insert if:
-- 1. It's a guest claim (awscc_id is null) - Open to public
-- 2. OR It's a member claim matching the logged-in user
CREATE POLICY "Public and Members can submit claims" ON public.event_claims 
FOR INSERT WITH CHECK (
    awscc_id IS NULL OR 
    awscc_id = (SELECT awsccpup_id FROM public.users WHERE id = auth.uid())
);

-- ============================================================================
-- THE SMART TRIGGER (Handles Guests Gracefully)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.award_event_points()
RETURNS TRIGGER AS $$
DECLARE
    target_user_uuid UUID;
BEGIN
    -- CHECK: Is this a Guest?
    IF NEW.awscc_id IS NULL THEN
        -- It is a guest. Do nothing. Just return.
        RETURN NEW;
    END IF;

    -- If we are here, it is a Member. Proceed with Points Logic.
    
    -- 1. LOOKUP: Find the User UUID based on the AWSCC ID
    SELECT id INTO target_user_uuid 
    FROM public.users 
    WHERE awsccpup_id = NEW.awscc_id;

    -- 2. AWARD: Give 200 points
    IF target_user_uuid IS NOT NULL THEN
        UPDATE public.profiles
        SET points = points + 200,
            updated_at = NOW()
        WHERE id = target_user_uuid;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger
CREATE TRIGGER on_event_claim_submitted
    AFTER INSERT ON public.event_claims
    FOR EACH ROW
    EXECUTE FUNCTION public.award_event_points();