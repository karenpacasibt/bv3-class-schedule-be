const express = require("express");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const classroomRoutes = require("./classroom.routes");
const subjectRoutes = require("./subject.routes");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/auth", authRoutes);

router.use(authMiddleware.verifyToken);

router.use("/user", userRoutes);
router.use("/classrooms", classroomRoutes);
router.use("/subjects", subjectRoutes);
