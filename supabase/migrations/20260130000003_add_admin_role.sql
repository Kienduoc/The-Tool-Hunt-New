-- Create role enum
CREATE TYPE user_role AS ENUM ('user', 'admin', 'editor');

-- Add role to profiles
ALTER TABLE profiles 
ADD COLUMN role user_role DEFAULT 'user';

-- Create policy for Admin access
-- Only admins can see all profiles or update tools/videos/articles via dashboard
-- (For now, we rely on application level check + RLS for specific tables)

-- Update Tools Policy for Admin
CREATE POLICY "Admins can insert tools"
  ON tools FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update tools"
  ON tools FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete tools"
  ON tools FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Videos
CREATE POLICY "Admins can insert videos"
  ON videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update videos"
  ON videos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Articles
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Update RLS for articles to allow admins to see unpublished
CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );
