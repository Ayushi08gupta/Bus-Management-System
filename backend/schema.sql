-- Run this in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS bus_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bus_management;

CREATE TABLE IF NOT EXISTS students (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    enrollment      VARCHAR(50)     NOT NULL UNIQUE,
    route           VARCHAR(100)    NOT NULL,
    hashed_password VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'student',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
