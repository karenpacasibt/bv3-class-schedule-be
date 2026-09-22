const courseDecorator = (course) => {
    return {
        id: course.id,
        school_id: course.school_id,
        name: course.name,
        student_count: course.student_count
    };
};

const coursesListDecorator = (courses) => {
    if (!Array.isArray(courses)) return [];

    return courses.map((course) => courseDecorator(course));
};

module.exports = {
    courseDecorator,
    coursesListDecorator
};