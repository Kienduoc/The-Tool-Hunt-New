-- Add AI processing columns to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS ai_processing_status TEXT DEFAULT 'pending'; -- 'pending', 'processing', 'completed', 'failed'
ALTER TABLE videos ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS ai_error TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT false;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES profiles(id);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP WITH TIME ZONE;

-- Create AI processing logs table
CREATE TABLE IF NOT EXISTS ai_processing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  step TEXT NOT NULL, -- 'metadata', 'transcript', 'summary', 'timestamps', 'tools'
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_video ON ai_processing_logs(video_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_status ON ai_processing_logs(status);
