const express = require('express');
const router = express.Router();
const { store, update } = require('../controllers/school.controller');

router.post('/', store);
router.put('/', update);

module.exports = router;
