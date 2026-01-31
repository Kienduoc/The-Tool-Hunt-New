-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  affiliate_url TEXT,
  category TEXT NOT NULL,
  pricing_type TEXT NOT NULL, -- 'freemium', 'paid', 'free'
  pricing_level TEXT, -- 'easy', 'medium', 'expensive'
  status TEXT DEFAULT 'active', -- 'hot_trend', 'new_tool', 'popular', 'hunters_choice'
  use_cases TEXT[], -- Array of use cases
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  hunt_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_slug ON tools(slug);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  channel_name TEXT,
  duration INTEGER, -- in seconds
  view_count INTEGER DEFAULT 0,
  category TEXT,
  
  -- AI Processing Fields
  ai_summary TEXT,
  ai_processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  ai_processed_at TIMESTAMP WITH TIME ZONE,
  ai_error TEXT,
  admin_approved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_videos_category ON videos(category);

-- Video timestamps table
CREATE TABLE video_timestamps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL, -- in seconds
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_video_timestamps_video ON video_timestamps(video_id);

-- Video tools junction table
CREATE TABLE video_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  timestamp_id UUID REFERENCES video_timestamps(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, tool_id)
);

CREATE INDEX idx_video_tools_video ON video_tools(video_id);
CREATE INDEX idx_video_tools_tool ON video_tools(tool_id);

-- Hunted tools table (User saved collection)
CREATE TABLE hunted_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX idx_hunted_tools_user ON hunted_tools(user_id);
CREATE INDEX idx_hunted_tools_tool ON hunted_tools(tool_id);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Rich text/Markdown
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);

-- Article tools junction table
CREATE TABLE article_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, tool_id)
);

CREATE INDEX idx_article_tools_article ON article_tools(article_id);
CREATE INDEX idx_article_tools_tool ON article_tools(tool_id);

-- Affiliate clicks table
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source_page TEXT, -- 'catalog', 'video', 'article', 'hunted'
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_tool ON affiliate_clicks(tool_id);
CREATE INDEX idx_affiliate_clicks_created ON affiliate_clicks(created_at);

-- AI Processing Logs
CREATE TABLE ai_processing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  step TEXT NOT NULL, -- 'metadata', 'transcript', 'summary', 'timestamps', 'tools'
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  details TEXT, -- JSON string or text details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_video ON ai_processing_logs(video_id);

-- Row Level Security Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tools (public read, admin write)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone"
  ON tools FOR SELECT
  USING (true);

-- Videos (public read)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

-- Hunted tools (private to user)
ALTER TABLE hunted_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hunted tools"
  ON hunted_tools FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hunted tools"
  ON hunted_tools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hunted tools"
  ON hunted_tools FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hunted tools"
  ON hunted_tools FOR DELETE
  USING (auth.uid() = user_id);

-- Articles (public read published)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (published = true);

-- Affiliate clicks (insert only, no read)
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert affiliate clicks"
  ON affiliate_clicks FOR INSERT
  WITH CHECK (true);
