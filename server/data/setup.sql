-- Drop Tables if they exist
DROP TABLE IF EXISTS  shareboard_notes, shareboard_board_columns, shareboard_users, shareboard_shareboards, shareboard_logs CASCADE;

-- Create Shareboard Table
CREATE TABLE shareboard_shareboards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create User Table
CREATE TABLE shareboard_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rights BOOLEAN NOT NULL,
    shareboard_fk INTEGER REFERENCES shareboard_shareboards(id) ON DELETE CASCADE,
    email VARCHAR(255),
    shareboard_key VARCHAR(255) UNIQUE NOT NULL
);

-- Create Board Column Table
CREATE TABLE shareboard_board_columns (
    id SERIAL PRIMARY KEY,
    shareboard_fk INTEGER REFERENCES shareboard_shareboards(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    position INTEGER
);

-- Create Notes Table
CREATE TABLE shareboard_notes (
    id SERIAL PRIMARY KEY,
    shareboard_fk INTEGER REFERENCES shareboard_shareboards(id) ON DELETE CASCADE,
    board_column_fk INTEGER REFERENCES shareboard_board_columns(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_fk INTEGER REFERENCES shareboard_users(id) ON DELETE SET NULL,
    priority VARCHAR(255) DEFAULT 'No Priority',
    assignee VARCHAR(255) DEFAULT 'nobody',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Log Table
CREATE TABLE shareboard_logs (
    id SERIAL PRIMARY KEY,
    shareboard_fk INTEGER REFERENCES shareboard_shareboards(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
