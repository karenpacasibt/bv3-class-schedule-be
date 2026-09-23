const checkAvailability = require('./availability.validator');

const validateClassSession = async (data, classSessionId = null, schoolId = null) => {
    return checkAvailability({
        classroom_id: data.classroom_id,
        teacher_id: data.teacher_id,
        course_id: data.course_id,
        day: data.day,
        time_slot_id: data.time_slot_id,
        school_id: schoolId,
        classSessionId,
    });
};

module.exports = validateClassSession;
module.exports.validateClassSession = validateClassSession;