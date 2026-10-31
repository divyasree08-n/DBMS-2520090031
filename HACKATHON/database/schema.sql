-- =============================================================================
-- KLH Campus Complaint Management System (CCMS)
-- Database Architecture & 3NF Relational Schema for MySQL 8.0
-- University: KLH University (K L Deemed to be University, Hyderabad)
-- Strictly Localized: Indian Standard Time (IST), KLH Campuses & Staff
-- =============================================================================

CREATE DATABASE IF NOT EXISTS klh_complaint_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE klh_complaint_db;

-- -----------------------------------------------------------------------------
-- 1. ROLES TABLE (RBAC)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO roles (role_id, name, description) VALUES
(1, 'ROLE_STUDENT', 'KLH Student Complainant with issue reporting and feedback rights'),
(2, 'ROLE_FACULTY', 'KLH Faculty Complainant'),
(3, 'ROLE_ADMIN', 'Dean of Campus Infrastructure and Estate Administrators'),
(4, 'ROLE_STAFF', 'Technical Maintenance and Resolution Staff')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 2. DEPARTMENTS TABLE (KLH University Infrastructure)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    head_of_department VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO departments (department_id, name, code, head_of_department, contact_email, contact_phone) VALUES
(1, 'Electrical Maintenance', 'ELEC', 'Er. Sandeep Joshi', 'elec.maint@klh.edu.in', '+91 98765 43210'),
(2, 'Campus IT & Wi-Fi Operations', 'NETW', 'Prof. R. Venkataraman', 'it.support@klh.edu.in', '+91 98765 43211'),
(3, 'Water & Public Health (PHE)', 'PLUM', 'Mr. Kailash Mehra', 'water.works@klh.edu.in', '+91 98765 43212'),
(4, 'KLH Hostel Administration', 'HOST', 'Dr. Anita Desai', 'hostels@klh.edu.in', '+91 98765 43213'),
(5, 'Campus Housekeeping & Sanitation', 'CLEAN', 'Mrs. Geeta Patel', 'sanitation@klh.edu.in', '+91 98765 43214'),
(6, 'Carpentry & Civil Infrastructure', 'FURN', 'Mr. Manoj Sharma', 'estate.civil@klh.edu.in', '+91 98765 43215'),
(7, 'KLH Campus Security & Safety', 'SEC', 'Col. Devendra Singh', 'security@klh.edu.in', '+91 98765 43216')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 3. USERS TABLE (Hashed Passwords, Role and Department)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. 2300030142 or KLH-ADM-01
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role_id INT NOT NULL,
    department_id INT NULL,
    campus VARCHAR(100) DEFAULT 'Bowrampet Campus',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments (department_id) ON DELETE SET NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role_id)
) ENGINE=InnoDB;

-- Seed Users (BCrypt hash for 'Password@123', 'Admin@123', 'Staff@123')
INSERT INTO users (user_id, college_id, full_name, email, password_hash, phone_number, role_id, department_id, campus) VALUES
(101, '2300030142', 'Aarav Sharma', 'aarav.sharma@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 98111 22334', 1, NULL, 'Bowrampet Campus'),
(102, 'KLH-FAC-102', 'Prof. K. Raghavan', 'prof.raghavan@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 98111 22335', 2, NULL, 'Aziznagar Campus'),
(201, 'KLH-ADM-01', 'Dr. Sunita Rao', 'admin@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 98222 33445', 3, 6, 'Bowrampet & Aziznagar'),
(301, 'TECH-IND-4102', 'Rajesh Kumar', 'rajesh.kumar@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 94123 45671', 4, 1, 'Bowrampet Campus'),
(302, 'TECH-IND-4103', 'Amit Verma', 'amit.verma@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 94123 45672', 4, 2, 'Bowrampet Campus'),
(303, 'TECH-IND-4104', 'Ramesh Yadav', 'ramesh.yadav@klh.edu.in', '$2a$12$e8Y6bFpT5xQGvT3JtP5mZeB/Zq9YyQzS1nUu5r0xY.lOqK8e.F2.W', '+91 94123 45673', 4, 3, 'Aziznagar Campus')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- -----------------------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    default_department_id INT NOT NULL,
    default_sla_hours INT NOT NULL DEFAULT 24,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_categories_department FOREIGN KEY (default_department_id) REFERENCES departments (department_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO categories (category_id, name, code, default_department_id, default_sla_hours, description) VALUES
(1, 'Electrical', 'ELEC', 1, 4, 'Power failure, short circuit, switchboard, fans, AC, MCB breaker'),
(2, 'Internet/Network', 'NETW', 2, 3, 'KLH Wi-Fi, LAN port, LMS portal connectivity, firewall, speed'),
(3, 'Plumbing', 'PLUM', 3, 6, 'Pipeline burst, tap leakage, low water pressure, geyser, flush tank'),
(4, 'Hostel', 'HOST', 4, 12, 'Hostel room amenities, mess food hygiene, hot water, window mosquito mesh'),
(5, 'Cleanliness', 'CLEAN', 5, 4, 'Washroom sanitation, corridor cleaning, classroom dustbin clearance'),
(6, 'Furniture', 'FURN', 6, 24, 'Classroom benches, broken chairs, whiteboard, seminar podium, door hinges'),
(7, 'Security', 'SEC', 7, 1, 'Emergency fire exit, security latch, parking safety, CCTV, perimeter lighting')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 5. COMPLAINTS TABLE (Core Entity with AI Fields & Status)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. CCMS-2026-0819
    complainant_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    ai_suggested_priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NULL,
    ai_confidence_score DECIMAL(4,3) NULL,
    status ENUM('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED') NOT NULL DEFAULT 'SUBMITTED',
    assigned_to_user_id BIGINT NULL,
    resolution_remarks TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expected_resolution_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_complaints_complainant FOREIGN KEY (complainant_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_category FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_complaints_staff FOREIGN KEY (assigned_to_user_id) REFERENCES users (user_id) ON DELETE SET NULL,
    INDEX idx_complaints_status (status),
    INDEX idx_complaints_priority (priority),
    INDEX idx_complaints_tracking (tracking_number),
    INDEX idx_complaints_created (created_at)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. STATUS HISTORY TABLE (Complete Lifecycle Audit Journal in IST)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS status_history (
    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    from_status VARCHAR(50) NULL,
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    remarks TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (complaint_id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users (user_id) ON DELETE RESTRICT,
    INDEX idx_history_complaint (complaint_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. FEEDBACK TABLE (Post-Resolution 1-5 Star Review)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL UNIQUE,
    complainant_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (complaint_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (complainant_id) REFERENCES users (user_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. ANALYTICAL VIEWS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_department_performance AS
SELECT 
    d.department_id,
    d.name AS department_name,
    d.code AS department_code,
    d.head_of_department,
    COUNT(c.complaint_id) AS total_complaints,
    SUM(CASE WHEN c.status IN ('RESOLVED', 'CLOSED') THEN 1 ELSE 0 END) AS resolved_complaints,
    SUM(CASE WHEN c.status IN ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'REOPENED') THEN 1 ELSE 0 END) AS pending_complaints,
    ROUND(AVG(CASE WHEN c.resolved_at IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, c.created_at, c.resolved_at) ELSE NULL END) / 60, 2) AS avg_resolution_hours,
    ROUND((SUM(CASE WHEN c.status IN ('RESOLVED', 'CLOSED') THEN 1 ELSE 0 END) / NULLIF(COUNT(c.complaint_id), 0)) * 100, 1) AS sla_compliance_pct
FROM departments d
JOIN categories cat ON d.department_id = cat.default_department_id
LEFT JOIN complaints c ON cat.category_id = c.category_id
GROUP BY d.department_id, d.name, d.code, d.head_of_department;
