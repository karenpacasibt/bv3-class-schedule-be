const { Course, Classroom, Subject, Teacher, TimeSlot, ClassSession } = require('../models');
const { Op } = require('sequelize');

const ROOM_TYPES = {
    'COMMON': 'un aula comun',
    'LAB': 'un laboratorio',
    'COMPUTER': 'un aula de computacion'
};

const checkRules = async ({ course_id, classroom_id, subject_id, teacher_id, time_slot_id, school_id, session_id = null }) => {
    const [course, classroom, subject, teacher, timeSlot] = await Promise.all([
        Course.findOne({ where: { id: course_id, school_id } }),
        Classroom.findOne({ where: { id: classroom_id, school_id} }),
        Subject.findOne({ where: { id: subject_id, school_id} }),
        Teacher.findOne({ where: { id: teacher_id, school_id} }),
        TimeSlot.findByPk(time_slot_id)
    ]);

    if (!course || !classroom || !subject || !teacher) {
        return "La materia, docente, aula o curso no existen o no pertenecen a este colegio";
    }
    if (!timeSlot) {
        return "La franja horaria especificada no existe";
    }
    if (course.student_count > classroom.capacity) {
        return `${course.name} tiene ${course.student_count} estudiantes y ${classroom.name} solo tiene ${classroom.capacity} lugares`;
    }

    if (subject.required_room_type !== classroom.type) {
        return `${subject.name} necesita ${ROOM_TYPES[subject.required_room_type]} y ${classroom.name} es ${ROOM_TYPES[classroom.type]}`;
    }

    const whereClause = { teacher_id: teacher.id, school_id: teacher.school_id };
    
    if (session_id) {
        whereClause.id = { [Op.ne]: session_id };
    }

    const currentSessionsCount = await ClassSession.count({ where: whereClause });
    const projectedHours = (currentSessionsCount * 2) + 2;

    if (projectedHours > teacher.max_weekly_hours) {
        return `${teacher.name} llegaria a ${projectedHours} h y su tope es de ${teacher.max_weekly_hours} h`;
    }

    return null;
};

module.exports = checkRules;
