-- Student Discount Migration Script
-- Run this script to add student discount functionality to existing installations

-- Add student-related columns to the account table if they don't exist
DO $$ 
BEGIN
    -- Add is_student column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'is_student') THEN
        ALTER TABLE public.account ADD COLUMN is_student boolean DEFAULT FALSE;
    END IF;

    -- Add student_email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'student_email') THEN
        ALTER TABLE public.account ADD COLUMN student_email character varying;
    END IF;

    -- Add student_verification_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'student_verification_date') THEN
        ALTER TABLE public.account ADD COLUMN student_verification_date date;
    END IF;
END $$;

-- Sample data: Add a test student account (optional - remove if not needed)
-- INSERT INTO public.account 
-- (account_firstname, account_lastname, account_email, account_password, account_type, is_student, student_email, student_verification_date)
-- VALUES 
-- ('Test', 'Student', 'test@example.com', '$2a$10$hashedpassword', 'Client', TRUE, 'test.student@university.edu', CURRENT_DATE);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'account' 
AND column_name IN ('is_student', 'student_email', 'student_verification_date')
ORDER BY column_name;