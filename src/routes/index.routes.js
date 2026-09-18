const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const classroomRoutes = require('./classroom.routes');
const teacherRoutes = require('./teacher.routes');
const schoolRoutes = require('./school.routes');

const authMiddleware = require('../middlewares/auth.middleware');
const schoolMiddleware = require('../middlewares/school.middleware');

const router = express.Router();

router.use('/auth', authRoutes);

router.use(authMiddleware.verifyToken);

router.use('/user', userRoutes);
router.use('/school', schoolRoutes);

router.use(schoolMiddleware.requireSchool);
router.use('/classrooms', classroomRoutes);
router.use('/teachers', teacherRoutes);


module.exports = router;