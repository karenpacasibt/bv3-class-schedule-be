const { Router } = require('express');
const { getScheduleProgress } = require('../controllers/progress.controller');

const router = Router();

router.get('/', getScheduleProgress); 

module.exports = router;
