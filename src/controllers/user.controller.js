const { User, School } = require('../models');
const userDecorator = require('../decorators/user.decorator');

exports.me = async (req, res) => {
    try {
        const user = await User.findOne({
            include: [{ model: School, as: 'school' }],
            order: [['created_at', 'ASC']],
        });

        if (!user) {
            return res.status(404).json({ message: 'No query result for models User' });
        }

        return res.status(200).json({ data: userDecorator(user) });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching authenticated user' });
    }
};
