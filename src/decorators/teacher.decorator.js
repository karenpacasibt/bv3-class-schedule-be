const teacherDecorator = (teacher) => {
    if(!teacher) return null;

    return{
        id: teacher.id,
        name: teacher.name,
        max_weekly_hours: teacher.max_weekly_hours
    };
};

module.exports = teacherDecorator;
