module.exports = (sequelize, DataTypes) => {
    const Classroom = sequelize.define('Classroom', {
        id: {
            type: DataTypes.CHAR(26),
            primaryKey: true,
            allowNull: false
        },
        school_id: {
            type: DataTypes.CHAR(26),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: { min: 1 }
        },
        type: {
            type: DataTypes.ENUM('COMMON', 'LAB', 'COMPUTER'),
            allowNull: false
        },
    }, {
        tableName: 'classrooms',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
    });

    Classroom.associate = (models) => {
        Classroom.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
    };

    return Classroom;
};