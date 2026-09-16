const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/classroom.controller');

router.get('/', ClassroomController.index);
router.post('/', ClassroomController.store);
router.get('/:id', ClassroomController.show);
router.put('/:id', ClassroomController.update);
router.delete('/:id', ClassroomController.destroy);

module.exports = router;