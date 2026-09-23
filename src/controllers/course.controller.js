const {
  courseDecorator,
  coursesListDecorator,
} = require("../decorators/course.decorator");
const Joi = require("joi");
const validateULID = require("../utils/validateULID");
const { Course } = require("../models");
const { ulid } = require("ulid");
const paginate = require("../utils/paginate");
const checkInUse = require('../utils/checkInUse');

const courseFields = Joi.object({
  name: Joi.string().trim().required(),
  student_count: Joi.number().integer().min(1).required(),
});

const index = async (req, res) => {
  try {
    const query = {
      where: {
        school_id: req.user.school.id,
      },
      order: [["name", "ASC"]],
    };

    if (req.query.page === undefined) {
      const courses = await Course.findAll(query);
      return res.status(200).json({
        data: coursesListDecorator(courses),
      });
    }

    const pagination = paginate(req.query.page, req.query.limit);
    const { rows, count } = await Course.findAndCountAll({
      ...query,
      limit: pagination.limit,
      offset: pagination.offset,
    });

    return res.status(200).json({
      data: coursesListDecorator(rows),
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
        total_pages: Math.ceil(count / pagination.limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const show = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) {
      return res.status(400).json({
        error: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      data: courseDecorator(course),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const store = async (req, res) => {
  try {
    const { error, value } = courseFields.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const existingCourse = await Course.findOne({
      where: {
        school_id: req.user.school.id,
        name: value.name,
      },
    });

    if (existingCourse) {
      return res.status(409).json({
        error: "A course with this name already exists",
      });
    }

    const newCourse = await Course.create({
      id: ulid(),
      school_id: req.user.school.id,
      name: value.name,
      student_count: value.student_count,
    });

    return res.status(201).json({
      data: courseDecorator(newCourse),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const update = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) {
      return res.status(400).json({
        error: "Invalid course ID",
      });
    }

    const { error, value } = courseFields.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const existingCourse = await Course.findOne({
      where: {
        school_id: req.user.school.id,
        name: value.name,
      },
    });

    if (existingCourse && existingCourse.id !== req.params.id) {
      return res.status(409).json({
        error: "A course with this name already exists",
      });
    }

    const course = await Course.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    await course.update({
      name: value.name,
      student_count: value.student_count,
    });

    return res.status(200).json({
      data: courseDecorator(course),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const destroy = async (req, res) => {
  try {
    if (!validateULID(req.params.id)) {
      return res.status(400).json({
        error: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }
    const message = await checkInUse('course_id', course);

    if (message) {
      return res.status(422).json({ message });
    }

    await course.destroy({
      deleted_at: new Date(),
    });

    return res.status(200).json({
      data: courseDecorator(course),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
