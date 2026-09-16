const { Classroom } = require("../models");
const { Op } = require("sequelize");

const uniqueNameClassroom = async (name, school_id, classroomId = null) => {
  const where = { name, school_id };
  if (classroomId) {
    where.id = { [Op.ne]: classroomId };
  }

  const existingClassroom = await Classroom.findOne({ where });

  if (existingClassroom && existingClassroom.id !== classroomId) {
    return "A classroom with this name already exists in the school";
  }

  return null;
};

module.exports = { uniqueNameClassroom };
