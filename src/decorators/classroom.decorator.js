const classroomDecorator = classroom => ({
    id: classroom.id,
    name: classroom.name,
    capacity: classroom.capacity,
    type: classroom.type,
});

module.exports = classroomDecorator;