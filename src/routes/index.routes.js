const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const classroomRoutes = require('./classroom.routes');

router.use('/user', userRoutes);
router.use('/classrooms', classroomRoutes);

router.use('/', (req, res) => {
    res.json('Route not found');
});

module.exports = router;
