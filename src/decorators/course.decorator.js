export const courseDecorator = (course) => {
return {
    id: course.id,
    school_id: course.school_id,
    name: course.name,
    student_count: course.student_count,
  };
};

export const coursesListDecorator = (courses) => {
  if (!Array.isArray(courses)) return [];

  return courses.map((course) => courseDecorator(course));
};