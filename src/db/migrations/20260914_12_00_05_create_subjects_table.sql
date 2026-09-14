CREATE TABLE IF NOT EXISTS subjects (
    id CHAR(26) NOT NULL COMMENT 'ULID',

    school_id CHAR(26) NOT NULL,

    name VARCHAR(255) NOT NULL,
    weekly_hours TINYINT UNSIGNED NOT NULL,
    required_room_type ENUM('COMMON', 'LAB', 'COMPUTER') NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id),

    INDEX idx_subjects_school_id (school_id),

    CONSTRAINT fk_subjects_school
        FOREIGN KEY (school_id)
        REFERENCES schools (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_subjects_weekly_hours CHECK (weekly_hours > 0 AND weekly_hours % 2 = 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
