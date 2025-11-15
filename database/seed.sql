-- Seed data cho database
USE smart_university;

-- Xóa dữ liệu cũ (nếu cần)
-- TRUNCATE TABLE major_skills;
-- TRUNCATE TABLE major_suggestions;
-- TRUNCATE TABLE major_queries;
-- TRUNCATE TABLE career_suggestions;
-- TRUNCATE TABLE career_query_subjects;
-- TRUNCATE TABLE career_queries;

-- Insert Roadmaps
INSERT INTO roadmaps (id, name, description, icon_name) VALUES
('tech', 'Công nghệ & Kỹ thuật', 'Dành cho những người đam mê sáng tạo công nghệ, giải quyết vấn đề bằng logic và thuật toán.', 'Code'),
('business', 'Kinh doanh & Quản lý', 'Phù hợp với những ai có tư duy chiến lược, kỹ năng lãnh đạo và mong muốn phát triển kinh tế.', 'Briefcase'),
('arts', 'Nghệ thuật & Nhân văn', 'Con đường cho các tâm hồn sáng tạo, yêu cái đẹp, và muốn khám phá văn hóa, xã hội con người.', 'Palette')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    icon_name = VALUES(icon_name);

-- Insert Subjects
INSERT INTO subjects (id, name) VALUES
('math', 'Toán cao cấp'),
('physics', 'Vật lý đại cương'),
('oop', 'Lập trình hướng đối tượng'),
('data_structures', 'Cấu trúc dữ liệu & Giải thuật'),
('microeconomics', 'Kinh tế vi mô'),
('marketing', 'Marketing căn bản'),
('psychology', 'Tâm lý học đại cương'),
('philosophy', 'Triết học Mác-Lênin'),
('literature', 'Văn học Việt Nam hiện đại'),
('biology', 'Sinh học phân tử'),
('chemistry', 'Hóa học hữu cơ'),
('law', 'Pháp luật đại cương')
ON DUPLICATE KEY UPDATE name = VALUES(name);

