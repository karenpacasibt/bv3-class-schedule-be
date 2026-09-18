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
            msg: "La cantidad de estudiantes debe ser un número entero",
          },
          min: {
            args: [1],
            msg: "La cantidad de estudiantes debe ser mayor que 0",
          },
        },
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: false,
    }
  );

  return Course;
};