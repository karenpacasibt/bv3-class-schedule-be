module.exports = (sequelize, DataTypes) => {
  const TimeSlot = sequelize.define(
    "TimeSlot",
    {
      id: {
        type: DataTypes.TINYINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "time_slots",
      timestamps: false,
    },
  );

  TimeSlot.associate = (models) => {
    TimeSlot.hasMany(models.ClassSession, {
      foreignKey: "time_slot_id",
      as: "class_sessions",
    });
  };

  return TimeSlot;
};
