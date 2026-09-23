const { Op } = require('sequelize');
const { ClassSession, Classroom, Teacher, Course, Subject, TimeSlot } = require('../models');
const classSessionDecorator = require('../decorators/class-session.decorator');

const DAY_ES = {
    MONDAY: 'lunes',
    TUESDAY: 'martes',
    WEDNESDAY: 'miércoles',
    THURSDAY: 'jueves',
    FRIDAY: 'viernes',
};

const checkAvailability = async ({
    classroom_id,
    teacher_id,
    course_id,
    day,
    time_slot_id,
    school_id,
    classSessionId = null,
}) => {
    const where = {
        day,
        time_slot_id,
        [Op.or]: [
            { classroom_id },
            { teacher_id },
            { course_id },
        ],
    };

    if (school_id) {
        where.school_id = school_id;
    }

    if (classSessionId) {
        where.id = { [Op.ne]: classSessionId };
    }

    const conflicts = await ClassSession.findAll({
        where,
        include: [
            { model: Classroom, as: 'classroom', attributes: ['id', 'name'] },
            { model: Teacher, as: 'teacher', attributes: ['id', 'name'] },
            { model: Course, as: 'course', attributes: ['id', 'name'] },
            { model: Subject, as: 'subject', attributes: ['id', 'name'] },
            { model: TimeSlot, as: 'time_slot', attributes: ['id', 'start_time', 'end_time'] },
        ],
    });

    if (conflicts.length === 0) {
        return null;
    }

    const dayEs = DAY_ES[day] || day;

    const classroomConflict = conflicts.find(
        (conflict) => String(conflict.classroom_id) === String(classroom_id)
    );
    if (classroomConflict) {
        const d = classSessionDecorator(classroomConflict);
        return `${d.classroom.name} ya tiene ` +
            `${d.subject.name} de ${d.course.name} ` +
            `el ${dayEs} de ${d.time_slot.start_time} a ${d.time_slot.end_time}`;
    }

    const teacherConflict = conflicts.find(
        (conflict) => String(conflict.teacher_id) === String(teacher_id)
    );
    if (teacherConflict) {
        const d = classSessionDecorator(teacherConflict);
        return `${d.teacher.name} ya tiene ` +
            `${d.subject.name} de ${d.course.name} ` +
            `el ${dayEs} de ${d.time_slot.start_time} a ${d.time_slot.end_time}`;
    }

    const courseConflict = conflicts.find(
        (conflict) => String(conflict.course_id) === String(course_id)
    );
    if (courseConflict) {
        const d = classSessionDecorator(courseConflict);
        return `${d.course.name} ya tiene ` +
            `${d.subject.name} ` +
            `el ${dayEs} de ${d.time_slot.start_time} a ${d.time_slot.end_time}`;
    }

    return null;
};

module.exports = checkAvailability;