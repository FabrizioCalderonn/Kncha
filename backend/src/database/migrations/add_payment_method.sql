-- Migration: Add payment_method column to bookings table if it doesn't exist

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='bookings'
        AND column_name='payment_method'
    ) THEN
        ALTER TABLE bookings
        ADD COLUMN payment_method VARCHAR(20) DEFAULT 'pending';
    END IF;
END $$;
