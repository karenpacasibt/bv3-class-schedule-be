const calculateSubjectsProgress = (subjects = [], classes = [], courseId) => {
  let isCourseComplete = true;

  const progress = subjects.map((subject) => {
    const assignedClassesCount = classes.filter(
      (c) => c.course_id === courseId && c.subject_id === subject.id
    ).length;

    const requiredHours = subject.weekly_hours || 0;
    const assignedHours = assignedClassesCount * 2;
    const missingHours = Math.max(0, requiredHours - assignedHours);

    if (missingHours > 0) {
      isCourseComplete = false;
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

  return {
    subjectsProgress: progress,
    isCourseComplete,
  };
};

module.exports = { calculateSubjectsProgress };