CREATE TABLE IF NOT EXISTS classrooms (
    id CHAR(26) NOT NULL COMMENT 'ULID',

    school_id CHAR(26) NOT NULL,

    name VARCHAR(255) NOT NULL,
    capacity SMALLINT UNSIGNED NOT NULL,
    type ENUM('COMMON', 'LAB', 'COMPUTER') NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id),

    INDEX idx_classrooms_school_id (school_id),

    CONSTRAINT fk_classrooms_school
        FOREIGN KEY (school_id)
        REFERENCES schools (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_classrooms_capacity CHECK (capacity > 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
