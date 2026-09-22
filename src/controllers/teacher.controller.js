const teacherDecorator = require('../decorators/teacher.decorator');
const Joi = require('joi');
const validateULID = require('../utils/validateULID');
const { Teacher } = require('../models');
const { ulid } = require('ulid');

const teacherFields = Joi.object({
    name: Joi.string().trim().required(),
    max_weekly_hours: Joi.number().integer().min(2).multiple(2).required()
});

const index = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
        where: { school_id: req.user.school_id },
        order: [['name', 'ASC']]
        });
        return res.status(200).json({
            data: teachers.map(teacherDecorator)
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const show = async (req, res) => {
    try {
        if (!validateULID(req.params.id)){
            return res.status(400).json({ error: 'Invalid teacher ID' });
        }

        const teacher = await Teacher.findOne({
        where: { 
            id: req.params.id,
            school_id: req.user.school_id 
        }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        return res.status(200).json({
            data: teacherDecorator(teacher)
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const store = async (req, res) => {
    try {
        const { error, value } = teacherFields.validate(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message })
        }

        const newTeacher = await Teacher.create({
            id: ulid(),
            school_id: req.user.school_id,
            name: value.name,
            max_weekly_hours: value.max_weekly_hours
        });

        return res.status(201).json({
            data: teacherDecorator(newTeacher)
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const update = async (req, res) => {
    try {
        if (!validateULID(req.params.id)){
            return res.status(400).json({ error: 'Invalid teacher ID' });
        }

        const { error, value } = teacherFields.validate(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message })
        }

        const teacher = await Teacher.findOne({
            where: { 
                id: req.params.id,
                school_id: req.user.school_id 
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        await teacher.update({
            name: value.name,
            max_weekly_hours: value.max_weekly_hours
        });

        return res.status(200).json({
            data: teacherDecorator(teacher)
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const destroy = async (req, res) => {
    try {
        if (!validateULID(req.params.id)){
            return res.status(400).json({ error: 'Invalid teacher ID' });
        }

        const teacher = await Teacher.findOne({
            where: { 
                id: req.params.id,
                school_id: req.user.school_id 
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        await teacher.destroy();

        return res.status(200).json({
            data: teacherDecorator(teacher)
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};