const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, School } = require('../models');
const userDecorator = require('../decorators/user.decorator');
const config = require('../config/config');
const Joi = require('joi');
const {ulid} = require('ulid');
const hashPassword = require('../utils/hashPassword');


exports.register = async (req, res) => {
    try {
        const userValidator = Joi.object(
            {
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required().min(8).label('Password')
                .messages({'string.min': 'El password debe tener al menos 8 caracteres'})
        }
        );

        const { error } = userValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { firstname, lastname, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(422).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            id: ulid(),
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
            expiresIn: '7d',
        });

        return res.status(201).json({
            data: { token, user: userDecorator(user) }
        });

    } catch (err) {
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

exports.login = async (req, res) => {
    try {
         const userValidator = Joi.object(
            {
                email: Joi.string().email().required(),
                password: Joi.string().required()
            }
        );
        
        const { error } = userValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const user = await User.findOne({
            where: { email },
            include: [{ model: School, as: 'school' }],
        });

        if (!user) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const matches = await bcrypt.compare(password, user.password);

        if (!matches) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({ data: { token, user: userDecorator(user) } });
    } catch (err) {
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};