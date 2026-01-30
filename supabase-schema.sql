-- Supabase Database Schema for ClawdTM Clone

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    github_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Skill metadata
    version VARCHAR(20) DEFAULT '1.0.0',
    repository_url TEXT,
    documentation_url TEXT,
    tags TEXT[],
    
    -- Stats
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    
    -- Status
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill dependencies table
CREATE TABLE IF NOT EXISTS skill_dependencies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    dependency_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    version_constraint VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, dependency_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, user_id)
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, user_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, user_id)
);

-- Skill versions table
CREATE TABLE IF NOT EXISTS skill_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    changelog TEXT,
    download_url TEXT,
    file_size BIGINT,
    hash VARCHAR(64),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, version)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_author ON skills(author_id);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_skills_verified ON skills(is_verified) WHERE is_verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating);
CREATE INDEX IF NOT EXISTS idx_skills_downloads ON skills(downloads);
CREATE INDEX IF NOT EXISTS idx_skills_created ON skills(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_skill ON reviews(skill_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_skill ON downloads(skill_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_skill ON favorites(skill_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read all users
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Anyone can view skills
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);

-- Only verified users can create skills
CREATE POLICY "Verified users can create skills" ON skills FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = author_id AND email_verified = true)
);

-- Users can only update their own skills
CREATE POLICY "Users can update own skills" ON skills FOR UPDATE USING (auth.uid() = author_id);

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

-- Users can only create reviews for skills they've downloaded
CREATE POLICY "Users can create reviews for downloaded skills" ON reviews FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM downloads WHERE skill_id = skill_id AND user_id = auth.uid())
);

-- Users can only update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());

-- Insert sample data
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Search', 'search', 'Web search and information retrieval skills', 'search', '#3B82F6'),
('Development', 'development', 'Coding and software development tools', 'code', '#10B981'),
('Creative', 'creative', 'Image generation and creative tools', 'image', '#8B5CF6'),
('Data', 'data', 'Database and data management skills', 'database', '#F59E0B'),
('Analytics', 'analytics', 'Data analysis and visualization tools', 'chart-bar', '#EF4444'),
('AI Tools', 'ai-tools', 'Advanced AI and machine learning capabilities', 'robot', '#6B7280')
ON CONFLICT (slug) DO NOTHING;