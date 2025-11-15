-- =========================================
-- SMART UNIVERSITY DATABASE
-- AI Orientation Assistant
-- MySQL 8.0+
-- =========================================

CREATE DATABASE IF NOT EXISTS smart_university 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE smart_university;

-- =========================================
-- TABLE: roadmaps
-- =========================================
CREATE TABLE IF NOT EXISTS roadmaps (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: subjects
-- =========================================
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: users (optional)
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: major_queries
-- =========================================
CREATE TABLE IF NOT EXISTS major_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id VARCHAR(50) NOT NULL,
    user_id INT NULL,
    query_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_roadmap (roadmap_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: major_suggestions
-- =========================================
CREATE TABLE IF NOT EXISTS major_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_id INT NOT NULL,
    major_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (query_id) REFERENCES major_queries(id) ON DELETE CASCADE,
    INDEX idx_query (query_id),
    INDEX idx_major (major_name)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: major_skills
-- =========================================
CREATE TABLE IF NOT EXISTS major_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    major_suggestion_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (major_suggestion_id) REFERENCES major_suggestions(id) ON DELETE CASCADE,
    INDEX idx_suggestion (major_suggestion_id),
    INDEX idx_skill (skill_name)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: career_queries
-- =========================================
CREATE TABLE IF NOT EXISTS career_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    query_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: career_query_subjects
-- =========================================
CREATE TABLE IF NOT EXISTS career_query_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_query_id INT NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (career_query_id) REFERENCES career_queries(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_query_subject (career_query_id, subject_id),
    INDEX idx_query (career_query_id),
    INDEX idx_subject (subject_id)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: career_suggestions
-- =========================================
CREATE TABLE IF NOT EXISTS career_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_id INT NOT NULL,
    career_name VARCHAR(255) NOT NULL,
    description TEXT,
    suitability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (query_id) REFERENCES career_queries(id) ON DELETE CASCADE,
    INDEX idx_query (query_id),
    INDEX idx_career (career_name)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- SEED DATA
-- =========================================

INSERT INTO roadmaps (id, name, description, icon_name) VALUES
('tech', 'Công nghệ & Kỹ thuật', 'Dành cho những người thích công nghệ và giải quyết vấn đề bằng thuật toán.', 'Code'),
('business', 'Kinh doanh & Quản lý', 'Phù hợp với người có tư duy chiến lược và kỹ năng lãnh đạo.', 'Briefcase'),
('arts', 'Nghệ thuật & Nhân văn', 'Dành cho tâm hồn sáng tạo và yêu văn hóa.', 'Palette')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    icon_name = VALUES(icon_name);

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
