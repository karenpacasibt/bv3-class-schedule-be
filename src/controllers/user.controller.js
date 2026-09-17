const { User, School } = require('../models');
const userDecorator = require('../decorators/user.decorator');
const Joi = require('joi');

const updateSchema = Joi.object({
    firstname: Joi.string().required().label('nombre'),
    lastname: Joi.string().required().label('apellido'),
    email: Joi.string().email().required().label('correo'),
}).messages({
    'any.required': 'El campo {#label} es requerido',
    'string.empty': 'El campo {#label} no puede estar vacío',
    'string.email': 'El campo {#label} debe ser un email válido',
    'string.base': 'El campo {#label} debe ser un texto',
});


exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id,{
            include: [{ model: School, as: 'school' }],
        });

        if (!user) {
            return res.status(404).json({ message: 'No query result for models User' });
        }

        return res.status(200).json({ data: userDecorator(user) });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching authenticated user' });
    }
};


exports.updateMe = async (req, res) => {
    try {
        const { error } = updateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { firstname, lastname, email } = req.body;

        const owner = await User.findOne({ where: { email } });

        if (owner && owner.id !== req.user.id) {
            return res.status(422).json({ message: 'Ese correo ya está registrado' });
        }

        const user = await User.findByPk(req.user.id, {
            include: [{ model: School, as: 'school' }],
        });

        if (!user) {
            return res.status(404).json({ message: 'No query result for models User' });
        }

        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;

        await user.save();

        return res.status(200).json({ data: userDecorator(user) });
    } catch (err) {
        return res.status(500).json({ error: 'Error updating authenticated user' });
    }
};
