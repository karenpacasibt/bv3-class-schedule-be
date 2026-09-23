const { Course, Subject, ClassSession } = require("../models"); 
const { calculateSubjectsProgress } = require("../utils/subjectsProgress");

const getScheduleProgress = async (req, res, next) => {
  try {
    const schoolId = req.user.school.id; 
    
    const [courses, subjects, classes] = await Promise.all([
      Course.findAll({ where: { school_id: schoolId } }),
      Subject.findAll({ where: { school_id: schoolId } }),
      ClassSession.findAll({ where: { school_id: schoolId } }) 
    ]);

    let totalComplete = true;

    const coursesProgress = courses.map((course) => {
      const { subjectsProgress, isCourseComplete } = calculateSubjectsProgress(
        subjects,
        classes,
        course.id
      );

      if (!isCourseComplete) {
        totalComplete = false;
      }

      return {
        course: {
          id: course.id,
          name: course.name,
        },
        complete: isCourseComplete,
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