const { ulid } = require("ulid");

module.exports = (sequelize, DataTypes) => {
  const ClassSession = sequelize.define(
    "ClassSession",
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
      subject_id: {
        type: DataTypes.CHAR(26),
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.CHAR(26),
        allowNull: false,
      },
      classroom_id: {
        type: DataTypes.CHAR(26),
        allowNull: false,
      },
      course_id: {
        type: DataTypes.CHAR(26),
        allowNull: false,
      },
      day: {
        type: DataTypes.ENUM(
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
        ),
        allowNull: false,
      },
      time_slot_id: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "class_sessions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: false,
      hooks: {
        beforeCreate: (classSession) => {
          classSession.id = ulid();
        },
      },
    },
  );

  ClassSession.associate = (models) => {
    ClassSession.belongsTo(models.School, {
      foreignKey: "school_id",
      as: "school",
    });
    ClassSession.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      as: "subject",
    });
    ClassSession.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
      as: "teacher",
    });
    ClassSession.belongsTo(models.Classroom, {
      foreignKey: "classroom_id",
      as: "classroom",
    });
    ClassSession.belongsTo(models.Course, {
      foreignKey: "course_id",
      as: "course",
    });
    ClassSession.belongsTo(models.TimeSlot, {
      foreignKey: "time_slot_id",
      as: "time_slot",
    });
  };

  return ClassSession;
};
