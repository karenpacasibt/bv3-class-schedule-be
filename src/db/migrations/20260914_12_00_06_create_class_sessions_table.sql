CREATE TABLE IF NOT EXISTS class_sessions (
    id CHAR(26) NOT NULL COMMENT 'ULID',

    school_id CHAR(26) NOT NULL,

    subject_id CHAR(26) NOT NULL,
    teacher_id CHAR(26) NOT NULL,
    classroom_id CHAR(26) NOT NULL,
    course_id CHAR(26) NOT NULL,

    day ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL,
    time_slot_id TINYINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_class_sessions_classroom_slot (classroom_id, day, time_slot_id),
    UNIQUE KEY uq_class_sessions_teacher_slot (teacher_id, day, time_slot_id),
    UNIQUE KEY uq_class_sessions_course_slot (course_id, day, time_slot_id),

    INDEX idx_class_sessions_school_id (school_id),
    INDEX idx_class_sessions_subject_id (subject_id),
    INDEX idx_class_sessions_time_slot_id (time_slot_id),

    CONSTRAINT fk_class_sessions_school
        FOREIGN KEY (school_id)
        REFERENCES schools (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_class_sessions_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_class_sessions_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_class_sessions_classroom
        FOREIGN KEY (classroom_id)
        REFERENCES classrooms (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_class_sessions_course
        FOREIGN KEY (course_id)
        REFERENCES courses (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_class_sessions_time_slot
        FOREIGN KEY (time_slot_id)
        REFERENCES time_slots (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
