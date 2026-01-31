-- Grant admin role to first user (run after signup)
-- Replace 'your-email@example.com' with your actual email

-- Option 1: By email
UPDATE profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);

-- Option 2: Make first registered user admin
UPDATE profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Verify admin was granted
SELECT p.id, p.full_name, p.role, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
