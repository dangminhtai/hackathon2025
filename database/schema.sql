-- Database Schema cho Đại học Thông minh - Trợ lý định hướng AI
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS smart_university CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_university;

-- Bảng lộ trình học tập
CREATE TABLE IF NOT EXISTS roadmaps (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng môn học
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng người dùng (tùy chọn, có thể mở rộng sau)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng lưu lịch sử truy vấn gợi ý chuyên ngành
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng lưu gợi ý chuyên ngành từ AI
CREATE TABLE IF NOT EXISTS major_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_id INT NOT NULL,
    major_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (query_id) REFERENCES major_queries(id) ON DELETE CASCADE,
    INDEX idx_query (query_id),
    INDEX idx_major_name (major_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng kỹ năng cốt lõi của chuyên ngành
CREATE TABLE IF NOT EXISTS major_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    major_suggestion_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (major_suggestion_id) REFERENCES major_suggestions(id) ON DELETE CASCADE,
    INDEX idx_major (major_suggestion_id),
    INDEX idx_skill (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng lưu lịch sử truy vấn gợi ý nghề nghiệp
CREATE TABLE IF NOT EXISTS career_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    query_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng quan hệ giữa career_queries và subjects
CREATE TABLE IF NOT EXISTS career_query_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_query_id INT NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (career_query_id) REFERENCES career_queries(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_query_subject (career_query_id, subject_id),
    INDEX idx_query (career_query_id),
    INDEX idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng lưu gợi ý nghề nghiệp từ AI
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

