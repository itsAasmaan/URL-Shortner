--enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--TABLES
-- users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--URLs table
CREATE TABLE IF NOT EXISTS urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    alias BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

--clicks table
CREATE TABLE IF NOT EXISTS clicks (
    id BIGSERIAL PRIMARY KEY,
    url_id BIGINT REFERENCES urls(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2)
);

-- URL metadata table (optional, for link previews)
CREATE TABLE IF NOT EXISTS url_metadata (
    id BIGSERIAL PRIMARY KEY,
    url_id BIGINT UNIQUE REFERENCES urls(id) ON DELETE CASCADE,
    title VARCHAR(500),
    description TEXT,
    image_url TEXT,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--INDEXES
-- For urls table
CREATE INDEX IF NOT EXISTS id_urls_short_code ON urls(short_code);

CREATE INDEX IF NOT EXISTS id_urls_user_id ON urls(user_id);

CREATE INDEX IF NOT EXISTS id_urls_created_at ON urls(created_at);

CREATE INDEX IF NOT EXISTS id_urls_expires_at ON urls(expires_at);

-- For clicks table
CREATE INDEX IF NOT EXISTS id_clicks_url_id ON clicks(url_id);

CREATE INDEX IF NOT EXISTS id_clicks_clicked_at ON clicks(clicked_at);

--function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for URL statistics
CREATE OR REPLACE VIEW url_stats AS
SELECT
    u.id,
    u.short_code,
    u.original_url,
    u.created_at,
    u.expires_at,
    u.active,
    COUNT(c.id) as total_clicks,
    MAX(c.clicked_at) as last_clicked
FROM
    urls u
    LEFT JOIN clicks c ON u.id = c.url_id
GROUP BY
    u.id,
    u.short_code,
    u.original_url,
    u.created_at,
    u.expires_at,
    u.active;