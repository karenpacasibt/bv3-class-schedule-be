CREATE TABLE IF NOT EXISTS teachers (
    id CHAR(26) NOT NULL COMMENT 'ULID',
    school_id CHAR(26) NOT NULL,
    name VARCHAR(255) NOT NULL,
    max_weekly_hours TINYINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id),

    INDEX idx_teachers_school_id (school_id),

    CONSTRAINT fk_teachers_school
        FOREIGN KEY (school_id)
        REFERENCES schools (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_teachers_max_weekly_hours CHECK (max_weekly_hours > 0 AND max_weekly_hours % 2 = 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
