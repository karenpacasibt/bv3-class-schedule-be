const Teacher = sequelize.define(
  "Teacher",
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
      validate: {
        notEmpty: { msg: "The name is mandatory" },
      },
    },
    max_weekly_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [2],
          msg: "The maximum number of hours must be greater than 0",
        },
        isEven(value) {
          if (value % 2 !== 0) {
            throw new Error(
              "The maximum number of hours must be an even number",
            );
          }
        },
      },
    },
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
};

return Teacher;
