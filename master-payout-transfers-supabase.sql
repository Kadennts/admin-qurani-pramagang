CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.master_payout_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guru_id UUID REFERENCES public.master_guru(id) ON DELETE SET NULL,
    guru_name VARCHAR(255) NOT NULL,
    guru_email VARCHAR(255),
    bank_name VARCHAR(100),
    payment_channel VARCHAR(50) DEFAULT 'Transfer Bank',
    gross_amount BIGINT DEFAULT 0,
    platform_fee_amount BIGINT DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    net_amount BIGINT DEFAULT 0,
    order_count INT DEFAULT 0,
    covered_order_ids UUID[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'Pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.master_payout_transfers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'master_payout_transfers'
          AND policyname = 'Public can select payout transfers.'
    ) THEN
        CREATE POLICY "Public can select payout transfers."
        ON public.master_payout_transfers
        FOR SELECT
        USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'master_payout_transfers'
          AND policyname = 'Public can insert payout transfers.'
    ) THEN
        CREATE POLICY "Public can insert payout transfers."
        ON public.master_payout_transfers
        FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'master_payout_transfers'
          AND policyname = 'Public can update payout transfers.'
    ) THEN
        CREATE POLICY "Public can update payout transfers."
        ON public.master_payout_transfers
        FOR UPDATE
        USING (true);
    END IF;
END $$;
