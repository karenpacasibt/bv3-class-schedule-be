CREATE TABLE IF NOT EXISTS time_slots (
    id TINYINT UNSIGNED NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    PRIMARY KEY (id),

    UNIQUE KEY uq_time_slots_start_time (start_time),

    CONSTRAINT chk_time_slots_range CHECK (end_time > start_time)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
