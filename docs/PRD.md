# Product Requirements Document (PRD)

| **Project Name** | **CERTEVAL: AWS Cloud Club PUP Certificate Generator** |
| :--- | :--- |
| **Version** | 2.0 (Finalized) |
| **Status** | Ready for Development |
| **Tech Stack** | Python (Backend), PostgreSQL (Database), Supabase (Auth/Storage), Google Drive/S3 (Proof Storage) |

-----

## 1\. Executive Summary

**Objective:** To automate the distribution of participation certificates for AWS Cloud Club PUP events while strictly enforcing the completion of the AWS Pulse Survey.
**Core Mechanism:** The system acts as a "Gate." Users cannot generate a certificate until they upload proof of survey completion.
**Incentive System:**

  * **Members:** Receive the certificate **AND** 200 community points instantly upon submission.
  * **Guests:** Receive the certificate only.

-----

## 2\. User Flows & Logic

### 2.1. The Branching Logic

The user experience splits based on their relationship with the organization.

1.  **Step 1: Identification**

      * User selects: *"Are you a Member?"* (Yes/No).
      * **If YES:** User inputs their `AWSCC ID`. System validates existence in the `sbd_members` whitelist.
      * **If NO:** User inputs their `Full Name` manually.

2.  **Step 2: Event Selection**

      * User selects an event from a dropdown.
      * **Constraint:** Only displays events scheduled for the **current date** (Philippine Standard Time).

3.  **Step 3: The Survey Gate**

      * System displays the **Pulse Survey Link** and a **Cheat Sheet** (Event ID/Venue Code required to fill the survey).
      * User completes the survey externally.

4.  **Step 4: Proof & Claim**

      * User uploads a screenshot of the "Thank You" screen.
      * **Action:** User clicks "Get Certificate".

5.  **Step 5: Instant Reward (Backend Logic)**

      * **Certificate:** Generated and downloaded immediately.
      * **Points:**
          * *Member:* Database Trigger detects the claim $\rightarrow$ **+200 Points** added to Profile.
          * *Guest:* Database Trigger detects Guest Name $\rightarrow$ **No Points** awarded.

-----

## 3\. Database Schema

This schema supports the "Hybrid" model (Members + Guests) and includes the automation trigger.

### 3.1. Tables

```sql
-- 1. EVENTS TABLE
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    event_date DATE NOT NULL,
    pulse_link TEXT,
    cheat_sheet_data JSONB, -- Stores Venue Code, Event ID for display
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENT CLAIMS TABLE (The Transaction Log)
CREATE TABLE public.event_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    
    -- IDENTITY COLUMNS (Mutually Exclusive)
    awscc_id TEXT REFERENCES public.sbd_members(awsccpup_id) ON DELETE CASCADE, 
    guest_name TEXT, 
    
    proof_url TEXT NOT NULL, -- URL to stored image
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CONSTRAINT: Must be EITHER Member OR Guest
    CONSTRAINT check_identity CHECK (
        (awscc_id IS NOT NULL AND guest_name IS NULL) OR 
        (awscc_id IS NULL AND guest_name IS NOT NULL)
    ),

    -- PREVENT DUPLICATES:
    UNIQUE NULLS NOT DISTINCT (event_id, awscc_id, guest_name)
);
```

### 3.2. Automation Trigger (The "Points Engine")

```sql
CREATE OR REPLACE FUNCTION public.award_event_points()
RETURNS TRIGGER AS $$
DECLARE
    target_user_uuid UUID;
BEGIN
    -- 1. GUEST CHECK: If awscc_id is NULL, it's a guest. Stop here.
    IF NEW.awscc_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- 2. MEMBER LOOKUP: Find User UUID based on Club ID
    SELECT id INTO target_user_uuid 
    FROM public.users 
    WHERE awsccpup_id = NEW.awscc_id;

    -- 3. AWARD: Instant 200 Points
    IF target_user_uuid IS NOT NULL THEN
        UPDATE public.profiles
        SET points = points + 200,
            updated_at = NOW()
        WHERE id = target_user_uuid;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_claim_submitted
    AFTER INSERT ON public.event_claims
    FOR EACH ROW
    EXECUTE FUNCTION public.award_event_points();
```

-----

## 4\. API Endpoints (Specification)

### 4.1. Public User Endpoints

#### `GET /api/events/active`

  * **Purpose:** Populates the dropdown.
  * **Logic:** Returns events where `event_date == NOW() AT TIME ZONE 'Asia/Manila'`.
  * **Response:**
    ```json
    [
      {
        "id": "uuid-...",
        "name": "Tech Kickoff",
        "pulse_link": "https://...",
        "cheat_sheet": { "venue": "Manila", "code": "123" }
      }
    ]
    ```

#### `POST /api/claim` (The Core Action)

  * **Content-Type:** `multipart/form-data`
  * **Payload (Member):**
      * `event_id`: "uuid-..."
      * `awscc_id`: "AWS-2025-01"
      * `proof_file`: [Binary Image]
  * **Payload (Guest):**
      * `event_id`: "uuid-..."
      * `guest_name`: "John Doe"
      * `proof_file`: [Binary Image]
  * **Backend Process:**
    1.  Upload `proof_file` to Storage (S3/Drive).
    2.  Insert record into `public.event_claims`.
          * *Note:* The SQL Trigger automatically awards points if `awscc_id` is present.
    3.  Generate PDF Certificate using **Pillow/ReportLab**.
  * **Response:** Returns the generated PDF file directly.

-----

## 5\. Functional Requirements (UI Components)

### 5.1. Verification Section

  * **Component:** Radio Button Group (`Member` | `Guest`).
  * **Logic:**
      * If `Member`: Show Input "Enter AWSCC ID".
      * If `Guest`: Show Input "Enter Full Name".

### 5.2. Survey "Cheat Sheet" Panel

  * **Trigger:** Appears after Event Selection.
  * **Content:**
      * **Copy Button:** Pulse Survey Link.
      * **QR Code:** Generated dynamically from the link.
      * **Info Card:** Displays `venue_code` and `event_id` so the user doesn't fail the survey validation.

### 5.3. Certificate Output

  * **Format:** PDF (Landscape).
  * **Dynamic Fields:**
      * **Name:** Populated from `guest_name` OR looked up via `awscc_id` from the `sbd_members` table.
      * **Date:** Current Date.
      * **Signature:** Pre-placed digital signature of the Director.

### 5.4. Social Sharing

  * **Feature:** "Share on LinkedIn" button on the success screen.
  * **Implementation:** Opens a new tab to `https://www.linkedin.com/sharing/share-offsite/...` with a pre-filled text draft regarding the event.

-----

## 6\. Technical Constraints & Security

1.  **No Approval Queue:** The system relies on "Trust but Verify." Points are awarded instantly. The uploaded proof is stored for *post-event* auditing if abuse is suspected.
2.  **Duplicate Prevention:** The Database `UNIQUE` constraint prevents a user from claiming the same event twice.
3.  **File Security:**
      * Allowed Types: `.jpg`, `.jpeg`, `.png`.
      * Max Size: 5MB.
4.  **Timezone:** Strict adherence to `Asia/Manila` for event visibility.

-----

## 7\. Future Admin Capabilities (Dashboard)

*While the current focus is the User Portal, the backend supports:*

1.  **Audit Logs:** View all rows in `event_claims` to see uploaded screenshots.
2.  **Event Creation:** Interface to insert rows into `public.events` with the cheat sheet JSON data.