const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { School } = require('../models');

const INVALID_SESSION = 'Tu sesión no es válida, vuelve a ingresar';

exports.verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ message: INVALID_SESSION });
        }

        let payload;

        try {
            payload = jwt.verify(token, config.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: INVALID_SESSION });
        }

        if (!payload || !payload.id) {
            return res.status(401).json({ message: INVALID_SESSION });
        }

        const school = await School.findOne({ where: { user_id: payload.id } });

        req.user = {
            id: payload.id,
            schoolId: school ? school.id : null,
        };

        return next();
    } catch (err) {
        return res.status(500).json({ error: 'Error al verificar la sesión' });
    }
};