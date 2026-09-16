const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const classroomRoutes = require('./classroom.routes');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/auth', authRoutes);

router.use(authMiddleware.verifyToken);

=======
const teacherRoutes = require('./teacher.routes');

const router = express.Router();

>>>>>>> 068687a (CLS-9: CRUD de docentes con tope de horas semanales)
router.use('/user', userRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/teachers', teacherRoutes);


module.exports = router;