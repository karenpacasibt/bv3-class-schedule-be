const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const classroomRoutes = require('./classroom.routes');

const router = express.Router();


router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/classrooms', classroomRoutes);

module.exports = router;