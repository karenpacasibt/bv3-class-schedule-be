const express = require("express");
const ClassSessionController = require("../controllers/class-session.controller");

const router = express.Router();

router.get("/time-slots", ClassSessionController.timeSlots);
router.get("/class-sessions", ClassSessionController.index);
router.get("/class-sessions/:id", ClassSessionController.show);
router.post("/class-sessions", ClassSessionController.store);
router.put("/class-sessions/:id", ClassSessionController.update);
router.delete("/class-sessions/:id", ClassSessionController.destroy);

module.exports = router;
