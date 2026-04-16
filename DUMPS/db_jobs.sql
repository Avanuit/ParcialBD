CREATE DATABASE IF NOT EXISTS db_jobs;
USE db_jobs;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS offer_required_skills;
DROP TABLE IF EXISTS job_offers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE job_offers (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(120) NOT NULL,
    company     VARCHAR(100) NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offer_required_skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    offer_id    INT NOT NULL,
    skill_name  VARCHAR(80) NOT NULL,
    min_level   INT NOT NULL COMMENT '1=basic, 2=intermediate, 3=advanced',
    FOREIGN KEY (offer_id) REFERENCES job_offers(id)
);

CREATE TABLE applications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    offer_id        INT NOT NULL,
    candidate_id    INT NOT NULL COMMENT 'referencia a db_talento',
    status          ENUM('pending', 'reviewed', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    applied_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES job_offers(id),
    UNIQUE (offer_id, candidate_id)
);

INSERT INTO job_offers (id, title, company) VALUES
(1, 'Backend Developer', 'Tech Solutions S.A.'),
(2, 'Frontend Developer', 'Creative Apps Ltda.'),
(3, 'Data Analyst', 'DataCore Inc.'),
(4, 'DevOps Engineer', 'CloudSystems Co.'),
(5, 'Full Stack Developer', 'Innovatech Group');

INSERT INTO offer_required_skills (offer_id, skill_name, min_level) VALUES
(1, 'SQL', 2), (1, 'Node.js', 1),
(2, 'HTML', 1), (2, 'JavaScript', 2),
(3, 'SQL', 1), (3, 'Python', 2),
(4, 'Docker', 1), (4, 'Linux', 2),
(5, 'JavaScript', 2), (5, 'Python', 1);

SELECT * FROM job_offers;