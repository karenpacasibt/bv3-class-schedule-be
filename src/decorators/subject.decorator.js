const subjectDecorator = (subject) => {
  if (!subject) return null;

  return {
    id: subject.id,
    name: subject.name,
    weekly_hours: subject.weekly_hours,
    required_room_type: subject.required_room_type,
  };
};

module.exports = subjectDecorator;
