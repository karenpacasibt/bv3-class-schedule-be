module.exports = (sequelize, DataTypes) => {
    const School = sequelize.define('School', {
        id: {
            type: DataTypes.CHAR(26),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(26),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: 'schools',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    School.associate = (models) => {
        School.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return School;
};
