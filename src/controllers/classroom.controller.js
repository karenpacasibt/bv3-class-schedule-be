const { User, School, Classroom } = require('../models');
const { ulid } = require('ulid');
const classroomDecorator = require('../decorators/classroom.decorator');
const { getSchoolId } = require('../utils/getSchool');
const { CLASSROOM_TYPES } = require('../constans/typeClassroom');
const Joi = require('joi');
const validateULID = require('../utils/validateULID');
const { uniqueNameClassroom } = require('../utils/validateClassroom');
const school_id_dummy = "01JYQZ9A4B5C6D7E8F9G0H1J2K"; //actualizar cuando este el middleware de autenticación

exports.index = async (req, res) => {
    try {
        const school_id = await getSchoolId(school_id_dummy);

        if (!school_id) {
            return res.status(404).json({ message: 'No school found for current user' });
        }

        const classrooms = await Classroom.findAll({ where: { school_id } });

        return res.status(200).json({ data: classrooms.map(classroomDecorator) });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching classrooms' });
    }
};

exports.store = async (req, res) => {
    try {
        const validateClassroom = Joi.object({
            name: Joi.string().trim().required(),
            capacity: Joi.number().integer().positive().required(),
            type: Joi.string().valid(...CLASSROOM_TYPES).required(),
        });
        const { error } = validateClassroom.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { name, capacity, type } = req.body;

        const school_id = await getSchoolId(school_id_dummy);
        const duplicateName = await uniqueNameClassroom(name, school_id);
        if (duplicateName) {
            return res.status(400).json({ message: duplicateName });
        }

        if (!school_id) {
            return res.status(404).json({ message: 'No school found for current user' });
        }

        const classroom = await Classroom.create({
            id: ulid(),
            school_id,
            name: String(name).trim(),
            capacity,
            type,
        });

        return res.status(201).json({ data: classroomDecorator(classroom) });
    } catch (err) {
        return res.status(500).json({ error: 'Error creating classroom' });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolValidateId = validateULID(id);
        if (!schoolValidateId) {
            return res.status(400).json({ message: 'Invalid classroom ID' });
        }
        
        const school_id = await getSchoolId(school_id_dummy);

        if (!school_id) {
            return res.status(404).json({ message: 'No school found for current user' });
        }

        const classroom = await Classroom.findOne({ where: { id, school_id } });

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        return res.status(200).json({ data: classroomDecorator(classroom) });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching classroom' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolValidateId = validateULID(id);
        if (!schoolValidateId) {
            return res.status(400).json({ message: 'Invalid classroom ID' });
        }
        const { name, capacity, type } = req.body;

        const validateClassroom = Joi.object({
            name: Joi.string().trim().required(),
            capacity: Joi.number().integer().positive().required(),
            type: Joi.string().valid(...CLASSROOM_TYPES).required(),
        });
        const { error } = validateClassroom.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const school_id = await getSchoolId(school_id_dummy);

        const duplicateName = await uniqueNameClassroom(name, school_id, id);
        if (duplicateName) {
            return res.status(400).json({ message: duplicateName });
        }

        if (!school_id) {
            return res.status(404).json({ message: 'No school found for current user' });
        }

        const classroom = await Classroom.findOne({ where: { id, school_id } });

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        await classroom.update({
            name: String(name).trim(),
            capacity,
            type,
        });

        return res.status(200).json({ data: classroomDecorator(classroom) });
    } catch (err) {        
        return res.status(500).json({ error: 'Error updating classroom' });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const school_id = await getSchoolId(school_id_dummy);

        if (!school_id) {
            return res.status(404).json({ message: 'No school found for current user' });
        }

        const classroom = await Classroom.findOne({ where: { id, school_id } });

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        await classroom.destroy();

        return res.status(200).json({ message: 'Classroom deleted', classroom: classroomDecorator(classroom) });
    } catch (err) {
        return res.status(500).json({ error: 'Error deleting classroom' });
    }
};