const { Op } = require('sequelize');
const { School } = require('../models');
const sequelize = require('../db/connection');

const validateSchool = async (name, excludeSchoolId = null) => {
    const normalizedName = name.trim().replace(/[^a-z0-9áéíóúñü]+/gi, ' ');

    const condition = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')),
        normalizedName.toLowerCase()
    );

    const query = {
        where: excludeSchoolId 
            ? { [Op.and]: [condition, { id: { [Op.ne]: excludeSchoolId }}] }
            : condition
    };

    const existingSchool = await School.findOne(query);

    return !existingSchool;
};

module.exports = validateSchool;
