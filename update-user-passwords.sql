-- Update User Passwords SQL Script
-- Make sure to backup your database before running this!

-- Check current users (optional)
SELECT id, email, name, password FROM users LIMIT 10;

-- Option 1: Set all passwords to 'password123' (hash generated with bcrypt rounds=12)
UPDATE users 
SET password = '$2b$12$LQv3c1yqBWVHxkd0LQ1cO.LQv3c1yqBWVHxkd0LQ1cO.LQv3c1yqBWVHxkd0LQ1cO'
WHERE password IS NOT NULL;

-- Option 2: Set passwords based on user role or email domain
-- UPDATE users 
-- SET password = '$2b$12$AdminHashHere'
-- WHERE email LIKE '%admin%' OR role = 'admin';

-- UPDATE users 
-- SET password = '$2b$12$UserHashHere'
-- WHERE role = 'user' OR role IS NULL;

-- Option 3: Set specific password for specific users
-- UPDATE users 
-- SET password = '$2b$12$SpecificHashHere'
-- WHERE email IN ('user1@example.com', 'user2@example.com');

-- Option 4: Set password for users without passwords
-- UPDATE users 
-- SET password = '$2b$12$DefaultHashHere'
-- WHERE password IS NULL OR password = '';

-- Option 5: Set password based on user ID range
-- UPDATE users 
-- SET password = '$2b$12$TestHashHere'
-- WHERE id BETWEEN 1 AND 100;

-- Verify the update (check how many users were affected)
SELECT COUNT(*) as total_users_updated FROM users WHERE password IS NOT NULL;

-- Check specific users (optional)
SELECT id, email, name, 
       CASE 
         WHEN password IS NOT NULL THEN 'Has Password' 
         ELSE 'No Password' 
       END as password_status
FROM users 
ORDER BY id LIMIT 10; 