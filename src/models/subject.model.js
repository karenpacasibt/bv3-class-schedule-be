const { ulid } = require("ulid");

module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define(
    "Subject",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      weekly_hours: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      required_room_type: {
        type: DataTypes.ENUM("COMMON", "LAB", "COMPUTER"),
        allowNull: false,
      },
    },
    {
      tableName: "subjects",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      hooks: {
        beforeCreate: (subject) => {
          subject.id = ulid();
        },
      },
    },
  );

  Subject.associate = (models) => {
    Subject.belongsTo(models.School, { foreignKey: "school_id", as: "school" });
  };

  return Subject;
};
