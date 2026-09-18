const courseDecorator = require('../decorators/course.decorator');
const Joi = require('joi');
const validateULID = require('../utils/validateULID');
const { Course } = require('../models');
const { ulid } = require('ulid');

const courseFields = Joi.object({
    name: Joi.string().trim().required(),
    student_count: Joi.number().integer().min(1).required()
});

const index = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: {
                school_id: req.user.school_id,
                deleted_at: null
            },
            order: [['name', 'ASC']]
        });

        return res.status(200).json({
            data: courses.map(courseDecorator)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

const show = async (req, res) => {
    try {
        if (!validateULID(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid course ID'
            });
        }

        const course = await Course.findOne({
            where: {
                id: req.params.id,
                school_id: req.user.school_id,
                deleted_at: null
            }
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        return res.status(200).json({
            data: courseDecorator(course)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

const store = async (req, res) => {
    try {
        const { error, value } = courseFields.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        const newCourse = await Course.create({
            id: ulid(),
            school_id: req.user.school_id,
            name: value.name,
            student_count: value.student_count
        });

        return res.status(201).json({
            data: courseDecorator(newCourse)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

const update = async (req, res) => {
    try {
        if (!validateULID(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid course ID'
            });
        }

        const { error, value } = courseFields.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        const course = await Course.findOne({
            where: {
                id: req.params.id,
                school_id: req.user.school_id,
                deleted_at: null
            }
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        await course.update({
            name: value.name,
            student_count: value.student_count
        });

        return res.status(200).json({
            data: courseDecorator(course)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

const destroy = async (req, res) => {
    try {
        if (!validateULID(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid course ID'
            });
        }

        const course = await Course.findOne({
            where: {
                id: req.params.id,
                school_id: req.user.school_id,
                deleted_at: null
            }
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        await course.update({
            deleted_at: new Date()
        });

        return res.status(200).json({
            data: courseDecorator(course)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};