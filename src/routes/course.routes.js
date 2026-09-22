const express = require('express');

const courseController = require('../controllers/course.controller');

const router = express.Router();

router.get('/', courseController.index);
router.get('/:id', courseController.show);
router.post('/', courseController.store);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.destroy);

module.exports = router;