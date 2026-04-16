CREATE DATABASE IF NOT EXISTS db_talent;
USE db_talent;

CREATE TABLE candidates (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    status      ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE candidate_skills (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id    INT NOT NULL,
    skill_id        INT NOT NULL,
    level           INT NOT NULL COMMENT '1=basic, 2=intermediate, 3=advanced',
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    FOREIGN KEY (skill_id)     REFERENCES skills(id),
    UNIQUE (candidate_id, skill_id)
);

CREATE TABLE certifications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id    INT NOT NULL,
    name            VARCHAR(120) NOT NULL,
    issued_date     DATE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);