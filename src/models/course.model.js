module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    tableName: "courses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  });

  return Course;
};
