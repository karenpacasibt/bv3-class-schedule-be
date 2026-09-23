const { ClassSession } = require('../models');

const checkInUse = async (foreignKey, record) => {
    const count = await ClassSession.count({
        where: {
            [foreignKey]: record.id,
            school_id: record.school_id,
        },
    });

    if (count === 0) return null;

    const classes = count === 1
        ? 'clase asignada'
        : 'clases asignadas';

    return `No se puede eliminar a ${record.name}: tiene ${count} ${classes}`;
};

module.exports = checkInUse;