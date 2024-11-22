-- Insert test data into shareboard_shareboards (2 Projects)
INSERT INTO shareboard_shareboards (name) 
VALUES ('Project Alpha'), ('Project Beta');

-- Insert test data into shareboard_users for Project Alpha
INSERT INTO shareboard_users (name, rights, shareboard_fk, email, shareboard_key) 
VALUES 
('Alice', true, 1, 'alice@alpha.com', 'key_alpha_1'), 
('Bob', false, 1, 'bob@alpha.com', 'key_alpha_2');

-- Insert test data into shareboard_users for Project Beta
INSERT INTO shareboard_users (name, rights, shareboard_fk, email, shareboard_key) 
VALUES 
('Charlie', true, 2, 'charlie@beta.com', 'key_beta_1'), 
('David', false, 2, 'david@beta.com', 'key_beta_2');

-- Insert test data into shareboard_board_columns for Project Alpha
INSERT INTO shareboard_board_columns (shareboard_fk, name, position) 
VALUES 
(1, 'To-Do', 1), 
(1, 'In Progress', 2), 
(1, 'Done', 3);

-- Insert test data into shareboard_board_columns for Project Beta
INSERT INTO shareboard_board_columns (shareboard_fk, name, position) 
VALUES 
(2, 'Backlog', 1), 
(2, 'In Development', 2), 
(2, 'Ready for Testing', 3);

-- Insert test data into shareboard_notes for Project Alpha
INSERT INTO shareboard_notes (shareboard_fk, board_column_fk, title, description, user_fk, priority) 
VALUES 
(1, 1, 'Design Wireframes', 'Create wireframes for the new project', 1, 1),
(1, 2, 'Develop API', 'Develop the API for the backend', 2, 2);

-- Insert test data into shareboard_notes for Project Beta
INSERT INTO shareboard_notes (shareboard_fk, board_column_fk, title, description, user_fk, priority) 
VALUES 
(2, 1, 'Initial Planning', 'Outline the scope and objectives of the project', 3, 1),
(2, 2, 'API Development', 'Work on API development for the mobile app', 4, 2);

-- Insert test data into shareboard_logs for Project Alpha
INSERT INTO shareboard_logs (shareboard_fk, message) 
VALUES 
(1, 'Project Alpha created'),
(1, 'Alice joined Project Alpha'),
(1, 'Bob joined Project Alpha'),
(1, 'First note created for Project Alpha');

-- Insert test data into shareboard_logs for Project Beta
INSERT INTO shareboard_logs (shareboard_fk, message) 
VALUES 
(2, 'Project Beta created'),
(2, 'Charlie joined Project Beta'),
(2, 'David joined Project Beta'),
(2, 'First note created for Project Beta');
