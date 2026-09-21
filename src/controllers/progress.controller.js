const { Course, Subject, Class } = require("../models"); 

const getScheduleProgress = async (req, res, next) => {
  try {
    const schoolId = req.user.school.id; 
    const [courses, subjects, classes] = await Promise.all([
      Course.findAll({ where: { school_id: schoolId } }),
      Subject.findAll({ where: { school_id: schoolId } }),
      Class.findAll({ where: { school_id: schoolId } }) 
    ]);

    let totalComplete = true;

    const coursesProgress = courses.map((course) => {
      let courseComplete = true;

      const subjectsProgress = subjects.map((subject) => {
        const assignedClassesCount = classes.filter(
          (c) => c.course_id === course.id && c.subject_id === subject.id
        ).length;

        const requiredHours = subject.weekly_hours;
        const assignedHours = assignedClassesCount * 2; 
        const missingHours = Math.max(0, requiredHours - assignedHours);

        if (missingHours > 0) {
          courseComplete = false;
        }

        return {
          subject: {
            id: subject.id,
            name: subject.name,
          },
          required_hours: requiredHours,
          assigned_hours: assignedHours,
          missing_hours: missingHours,
        };
      });

      if (!courseComplete) {
        totalComplete = false;
      }

      return {
        course: {
          id: course.id,
          name: course.name,
        },
        complete: courseComplete,
        subjects: subjectsProgress,
      };
    });

    if (courses.length === 0) {
      totalComplete = false;
    }

    return res.status(200).json({
      data: {
        complete: totalComplete,
        courses: coursesProgress,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getScheduleProgress };
