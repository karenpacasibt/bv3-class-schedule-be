const Joi = require("joi");
const {
  ClassSession,
  TimeSlot,
  Subject,
  Teacher,
  Classroom,
  Course,
} = require("../models");
const classSessionDecorator = require("../decorators/class-session.decorator");
const validateULID = require("../utils/validateULID");
const validateClassSession = require("../validators/class-session.validator");
const { ulid } = require("ulid");

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const sessionSchema = Joi.object({
  subject_id: Joi.string().required(),
  teacher_id: Joi.string().required(),
  classroom_id: Joi.string().required(),
  course_id: Joi.string().required(),
  day: Joi.string()
    .valid(...DAYS)
    .required(),
  time_slot_id: Joi.number().integer().positive().required(),
}).messages({
  "any.required": "All six class session fields are required",
  "any.only": "Day must be MONDAY, TUESDAY, WEDNESDAY, THURSDAY or FRIDAY",
});

const includes = [
  { model: Subject, as: "subject", attributes: ["id", "name"] },
  { model: Teacher, as: "teacher", attributes: ["id", "name"] },
  {
    model: Classroom,
    as: "classroom",
    attributes: ["id", "name", "capacity", "type"],
  },
  { model: Course, as: "course", attributes: ["id", "name", "student_count"] },
  {
    model: TimeSlot,
    as: "time_slot",
    attributes: ["id", "start_time", "end_time"],
  },
];

const noSchool = (res) =>
  res.status(404).json({ message: "No school found for current user" });

const notFound = (res) =>
  res.status(404).json({ message: "Class session not found" });

const validPayload = (body, res) => {
  const { error, value } = sessionSchema.validate(body, { abortEarly: false });
  if (error) {
    res
      .status(422)
      .json({ errors: error.details.map((detail) => detail.message) });
    return null;
  }
  return value;
};

const resourcesBelongToSchool = async (data, schoolId) => {
  const [subject, teacher, classroom, course, timeSlot] = await Promise.all([
    Subject.findOne({ where: { id: data.subject_id, school_id: schoolId } }),
    Teacher.findOne({ where: { id: data.teacher_id, school_id: schoolId } }),
    Classroom.findOne({
      where: { id: data.classroom_id, school_id: schoolId },
    }),
    Course.findOne({ where: { id: data.course_id, school_id: schoolId } }),
    TimeSlot.findByPk(data.time_slot_id),
  ]);

  return subject && teacher && classroom && course && timeSlot;
};

exports.timeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json({
      data: timeSlots.map((timeSlot) => ({
        id: timeSlot.id,
        start_time: String(timeSlot.start_time).slice(0, 5),
        end_time: String(timeSlot.end_time).slice(0, 5),
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching time slots" });
  }
};

exports.index = async (req, res) => {
  try {
    const schoolId = req.user.school?.id;
    if (!schoolId) return noSchool(res);

    const where = { school_id: schoolId };
    ["course_id", "teacher_id", "classroom_id"].forEach((field) => {
      if (req.query[field]) where[field] = req.query[field];
    });

    const classSessions = await ClassSession.findAll({
      where,
      include: includes,
      order: [["created_at", "ASC"]],
    });

    return res
      .status(200)
      .json({ data: classSessions.map(classSessionDecorator) });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching class sessions" });
  }
};

exports.show = async (req, res) => {
  try {
    const schoolId = req.user.school?.id;
    if (!schoolId) return noSchool(res);
    if (!validateULID(req.params.id)) return notFound(res);

    const classSession = await ClassSession.findOne({
      where: { id: req.params.id, school_id: schoolId },
      include: includes,
    });
    if (!classSession) return notFound(res);

    return res.status(200).json({ data: classSessionDecorator(classSession) });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching class session" });
  }
};

const save = async (req, res, classSession) => {
  const data = validPayload(req.body, res);
  if (!data) return null;

  const validationMessage = await validateClassSession(data, classSession?.id);
  if (validationMessage) {
    res.status(422).json({ message: validationMessage });
    return null;
  }

  const schoolId = req.user.school?.id;
  if (!(await resourcesBelongToSchool(data, schoolId))) {
    res
      .status(422)
      .json({
        message: "All class session resources must belong to the school",
      });
    return null;
  }

  return data;
};

exports.store = async (req, res) => {
  try {
    const schoolId = req.user.school?.id;
    if (!schoolId) return noSchool(res);
    const data = await save(req, res);
    if (!data) return;

    const classSession = await ClassSession.create({
      id: ulid(),
      school_id: schoolId,
      ...data,
    });
    await classSession.reload({ include: includes });
    return res.status(201).json({ data: classSessionDecorator(classSession) });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(422)
        .json({ message: "The class session conflicts with another class" });
    }
    return res.status(500).json({ error: "Error creating class session" });
  }
};

exports.update = async (req, res) => {
  try {
    const schoolId = req.user.school?.id;
    if (!schoolId) return noSchool(res);
    if (!validateULID(req.params.id)) return notFound(res);

    const classSession = await ClassSession.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });
    if (!classSession) return notFound(res);

    const data = await save(req, res, classSession);
    if (!data) return;
    await classSession.update(data);
    await classSession.reload({ include: includes });
    return res.status(200).json({ data: classSessionDecorator(classSession) });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(422)
        .json({ message: "The class session conflicts with another class" });
    }
    return res.status(500).json({ error: "Error updating class session" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const schoolId = req.user.school?.id;
    if (!schoolId) return noSchool(res);
    if (!validateULID(req.params.id)) return notFound(res);

    const classSession = await ClassSession.findOne({
      where: { id: req.params.id, school_id: schoolId },
      include: includes,
    });
    if (!classSession) return notFound(res);

    await classSession.destroy();
    return res.status(200).json({ data: classSessionDecorator(classSession) });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting class session" });
  }
};
