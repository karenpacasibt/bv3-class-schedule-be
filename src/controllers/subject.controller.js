const Joi = require("joi");
const { Subject } = require("../models");
const subjectDecorator = require("../decorators/subject.decorator");
const validateULID = require("../utils/validateULID");
const { ulid } = require("ulid");

const ROOM_TYPES = ["COMMON", "LAB", "COMPUTER"];

const WEEKLY_HOURS_EVEN_MESSAGE = "The hours per week must be an even number.";

const weeklyHours = Joi.number()
  .integer()
  .positive()
  .custom((value, helpers) => {
    if (value % 2 !== 0) {
      return helpers.message(WEEKLY_HOURS_EVEN_MESSAGE);
    }
    return value;
  })
  .messages({
    "number.base": "Weekly hours must be an integer greater than 0",
    "number.integer": "Weekly hours must be an integer greater than 0",
    "number.positive": "Weekly hours must be an integer greater than 0",
  });

const subjectCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  weekly_hours: weeklyHours.required().messages({
    "any.required": "Weekly hours is required",
  }),
  required_room_type: Joi.string()
    .valid(...ROOM_TYPES)
    .required()
    .messages({
      "any.only": "Room type must be COMMON, LAB or COMPUTER",
      "any.required": "Room type is required",
    }),
});

const subjectUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).messages({
    "string.empty": "Name is required",
  }),
  weekly_hours: weeklyHours,
  required_room_type: Joi.string()
    .valid(...ROOM_TYPES)
    .messages({
      "any.only": "Room type must be COMMON, LAB or COMPUTER",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided",
  });

const notFound = (res) =>
  res.status(404).json({ message: "No query result for model Subject" });

exports.index = async (req, res) => {
  try {
    const schoolId = req.user.school.id;

    const subjects = await Subject.findAll({
      where: { school_id: schoolId },
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({ data: subjects.map(subjectDecorator) });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching subjects" });
  }
};

exports.show = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) return notFound(res);

    const schoolId = req.user.school.id;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    return res.status(200).json({ data: subjectDecorator(subject) });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching subject" });
  }
};

exports.store = async (req, res) => {
  try {
    const schoolId = req.user.school.id;

    const { error, value } = subjectCreateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(422).json({
        errors: error.details.map((d) => d.message),
      });
    }

    const subject = await Subject.create({
      id: ulid(),
      school_id: schoolId,
      ...value,
    });

    return res.status(201).json({
      data: subjectDecorator(subject),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) return notFound(res);

    const schoolId = req.user.school.id;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    const { error, value } = subjectUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(422)
        .json({ errors: error.details.map((d) => d.message) });
    }

    await subject.update(value);

    return res.status(200).json({ data: subjectDecorator(subject) });
  } catch (err) {
    return res.status(500).json({ error: "Error updating subject" });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) return notFound(res);

    const schoolId = req.user.school.id;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    await subject.destroy();

    return res.status(200).json({
      data: {
        id: subject.id,
        name: subject.name,
        deleted_at: subject.deleted_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting subject" });
  }
};
