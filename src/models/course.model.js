module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.CHAR(26),
        primaryKey: true,
        allowNull: false,
      },

      school_id: {
        type: DataTypes.CHAR(26),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      student_count: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        validate: {
          isInt: {
            msg: "The number of students must be an integer.",
          },
          min: {
            args: [1],
            msg: "The number of students must be greater than zero.",
          },
        },
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    },
  );
  return Course;
};
