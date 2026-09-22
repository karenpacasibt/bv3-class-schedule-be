const subjectDecorator = require("./subject.decorator");
const teacherDecorator = require("./teacher.decorator");
const classroomDecorator = require("./classroom.decorator");
const { courseDecorator } = require("./course.decorator");
const timeSlotDecorator = require("./time-slot.decorator");

module.exports = (classSession) => {
  if (!classSession) return null;

  return {
    id: classSession.id,
    subject: classSession.subject
      ? subjectDecorator(classSession.subject)
      : { id: classSession.subject_id },
    teacher: classSession.teacher
      ? teacherDecorator(classSession.teacher)
      : { id: classSession.teacher_id },
    classroom: classSession.classroom
      ? classroomDecorator(classSession.classroom)
      : { id: classSession.classroom_id },
    course: classSession.course
      ? courseDecorator(classSession.course)
      : { id: classSession.course_id },
    day: classSession.day,
    time_slot: classSession.time_slot
      ? timeSlotDecorator(classSession.time_slot)
      : { id: classSession.time_slot_id },
  };
};
