module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true, allowNull: false },
      school_id: { type: DataTypes.CHAR(26), allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      max_weekly_hours: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
    },
    {
      tableName: "teachers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    },
  );

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.School, { foreignKey: "school_id", as: "school" });
    Teacher.hasMany(models.ClassSession, {
      foreignKey: "teacher_id",
      as: "class_sessions",
    });
  };

  return Teacher;
};
