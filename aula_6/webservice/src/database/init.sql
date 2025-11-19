-- Database initialization script for categories table

-- Drop table if exists (for development)
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX idx_categories_name ON categories(name);

-- Insert initial data
INSERT INTO categories (name, description, created_at, updated_at) VALUES
    ('Eletrônicos', 'Produtos eletrônicos como smartphones, laptops, etc.', '2023-09-01T10:00:00Z', '2023-09-01T10:00:00Z'),
    ('Acessórios', 'Acessórios para dispositivos eletrônicos', '2023-09-01T10:00:00Z', '2023-09-01T10:00:00Z'),
    ('Vestuário', 'Roupas e calçados', '2023-09-01T10:00:00Z', '2023-09-01T10:00:00Z');