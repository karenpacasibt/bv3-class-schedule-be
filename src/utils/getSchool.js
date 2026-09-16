const { User, School } = require('../models');

const getSchoolId = async (schoolId) => {
    if (schoolId) return schoolId;

    const foundUser = await User.findOne({
        include: [{ model: School, as: 'school' }],
        order: [['created_at', 'ASC']],
    });

    return foundUser?.school?.id || null;
};

exports.getSchoolId = getSchoolId;