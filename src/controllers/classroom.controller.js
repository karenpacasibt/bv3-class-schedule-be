const { User, School, Classroom } = require('../models');
const { ulid } = require('ulid');
const classroomDecorator = require('../decorators/classroom.decorator');

const CLASSROOM_TYPES = ['COMMON', 'LAB', 'COMPUTER'];

const getSchoolId = async (req) => {
    if (req.user?.schoolId) return req.user.schoolId;

    const user = await User.findOne({
        include: [{ model: School, as: 'school' }],
        order: [['created_at', 'ASC']],
    });

    return user?.school?.id || null;
};

const validateClassroom = ({ name, capacity, type }) => {
    if (name === undefined || name === null || String(name).trim() === '') {
        return 'El nombre es obligatorio';
    }
    if (!Number.isInteger(capacity) || capacity <= 0) {
        return 'La capacidad debe ser un número entero mayor a 0';
    }
    if (!CLASSROOM_TYPES.includes(type)) {
        return 'El tipo debe ser COMMON, LAB o COMPUTER';
    }
    return null;
};

exports.index = async (req, res) => {
    try {
        const school_id = await getSchoolId(req);

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
        const { name, capacity, type } = req.body;

        const error = validateClassroom({ name, capacity, type });
        if (error) {
            return res.status(400).json({ message: error });
        }

        const school_id = await getSchoolId(req);

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
        const school_id = await getSchoolId(req);

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
        const { name, capacity, type } = req.body;

        const error = validateClassroom({ name, capacity, type });
        if (error) {
            return res.status(400).json({ message: error });
        }

        const school_id = await getSchoolId(req);

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
        const school_id = await getSchoolId(req);

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