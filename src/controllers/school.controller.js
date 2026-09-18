const Joi = require('joi');
const { School } = require('../models');
const schoolDecorator = require('../decorators/school.decorator');
const validateSchool = require('../utils/validateSchool');
const { ulid } = require('ulid');

const schoolField = Joi.object({ name: Joi.string().trim().required() });

const store = async (req, res) => {
    try {
        if (req.user.school) {
            return res.status(422).json({ message: 'You already have a school registered' });
        }

        const { error, value } = schoolField.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const isUnique = await validateSchool(value.name);
        if(!isUnique){
            return res.status(422).json({ message: 'That school name is already registered' });
        }

        const normalizedName = value.name.trim().replace(/\s+/g, ' ');

        const newSchool = await School.create({
            id: ulid(),
            user_id: req.user.id,
            name: normalizedName
        });

        return res.status(201).json({ data: schoolDecorator(newSchool) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error when creating the school' });
    }
};

const update = async (req, res) => {
    try {
        if (!req.user.school) {
            return res.status(404).json({ message: 'You do not have a registered school to update' });
        }

        const { error, value } = schoolField.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const isUnique = await validateSchool(value.name, req.user.school.id);
        if (!isUnique){
            return res.status(422).json({ message: 'That school name is already registered' });
        }

        const school = await School.findOne({
            where: {
                id: req.user.school.id,
                user_id: req.user.id
            }
        });

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        const normalizedName = value.name.trim().replace(/\s+/g, ' ');
        await school.update({ name: normalizedName });

        return res.status(200).json({ data: schoolDecorator(school) });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error when updating the school' });
    }
};

module.exports = {
    store,
    update
};
