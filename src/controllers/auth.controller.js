const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, School } = require('../models');
const userDecorator = require('../decorators/user.decorator');
const config = require('../config/config');

exports.login = async (req, res) => {
    try {
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