-- Seed Tools
INSERT INTO tools (name, slug, description, website_url, category, pricing_type, status, use_cases, pricing_level)
VALUES 
  ('Cursor AI', 'cursor-ai', 'The AI-first code editor that helps you build faster.', 'https://cursor.sh', 'Development', 'freemium', 'hot_trend', ARRAY['Coding', 'Refactoring'], 'medium'),
  ('v0.dev', 'v0-dev', 'Generate UI with simple text prompts. Vercel''s generative UI tool.', 'https://v0.dev', 'Design', 'freemium', 'popular', ARRAY['UI Design', 'Prototyping'], 'free'),
  ('Bolt.new', 'bolt-new', 'Prompt to full-stack web app in browser.', 'https://bolt.new', 'Development', 'paid', 'new_tool', ARRAY['Full Stack', 'MVP'], 'medium');

-- Seed Video (Placeholder ID, assuming UUIDs generated typically)
-- We use a DO block to get IDs dynamically if needed, or just insert with subqueries.

DO $$
DECLARE
  v_id UUID := uuid_generate_v4();
  cursor_id UUID;
  v0_id UUID;
BEGIN
  SELECT id INTO cursor_id FROM tools WHERE slug = 'cursor-ai';
  SELECT id INTO v0_id FROM tools WHERE slug = 'v0-dev';

  INSERT INTO videos (id, youtube_id, title, description, thumbnail_url, channel_name, duration, category)
  VALUES (
    v_id,
    'dQw4w9WgXcQ', -- Rick Roll as placeholder or use a real one
    'Master Cursor AI in 10 Minutes',
    'Learn how to use Cursor AI to speed up your coding workflow by 10x.',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'The Tool Hunter',
    600,
    'Tutorial'
  );

  INSERT INTO video_timestamps (video_id, timestamp, title, description)
  VALUES
    (v_id, 0, 'Introduction', 'What is Cursor?'),
    (v_id, 120, 'Setup & Install', 'Getting started guide'),
    (v_id, 300, 'AI Features', 'Using Cmd+K and Chat');

  INSERT INTO video_tools (video_id, tool_id)
  VALUES (v_id, cursor_id);
  
END $$;
