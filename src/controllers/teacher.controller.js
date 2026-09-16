const teacherDecorator = require('../decorators/teacher.decorator');
const { Teacher } = require('../models');
const { ulid } = require('ulid');

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
        const { name, max_weekly_hours } = req.body;
        
        const newTeacher = await Teacher.create({
            id: ulid(),
            school_id: req.user.school_id,
            name,
            max_weekly_hours
        });

        return res.status(201).json({
            data: teacherDecorator(newTeacher)
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const update = async (req, res) => {
    try {
        const { name, max_weekly_hours } = req.body;

        const teacher = await Teacher.findOne({
            where: { 
                id: req.params.id,
                school_id: req.user.school_id 
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        teacher.name = name;
        teacher.max_weekly_hours = max_weekly_hours;
        await teacher.save();

        return res.status(200).json({
            message: 'Teacher successfully modified',
            data: teacherDecorator(teacher)
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const destroy = async (req, res) => {
    try {
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
            message: 'Teacher logically deleted',
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