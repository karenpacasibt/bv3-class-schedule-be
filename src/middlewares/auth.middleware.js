const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, School } = require('../models');
const userDecorator = require('../decorators/user.decorator');

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

        
        const user = await User.findByPk(payload.id, {
            include: [{model: School, as: 'school'}],
        });
        if (!user){
            return res.status(401).json({message: INVALID_SESSION});
        }

        req.user = userDecorator(user);

        return next();
    } catch (err) {
        return res.status(500).json({ error: 'Error al verificar la sesión' });
    }
};