const formatTime = (time) => (time ? String(time).slice(0, 5) : time);

module.exports = (classSession) => {
  if (!classSession) return null;

  return {
    id: classSession.id,
    subject: classSession.subject
      ? { id: classSession.subject.id, name: classSession.subject.name }
      : { id: classSession.subject_id },
    teacher: classSession.teacher
      ? { id: classSession.teacher.id, name: classSession.teacher.name }
      : { id: classSession.teacher_id },
    classroom: classSession.classroom
      ? {
          id: classSession.classroom.id,
          name: classSession.classroom.name,
          capacity: classSession.classroom.capacity,
          type: classSession.classroom.type,
        }
      : { id: classSession.classroom_id },
    course: classSession.course
      ? {
          id: classSession.course.id,
          name: classSession.course.name,
          student_count: classSession.course.student_count,
        }
      : { id: classSession.course_id },
    day: classSession.day,
    time_slot: classSession.time_slot
      ? {
          id: classSession.time_slot.id,
          start_time: formatTime(classSession.time_slot.start_time),
          end_time: formatTime(classSession.time_slot.end_time),
        }
      : { id: classSession.time_slot_id },
  };
};
