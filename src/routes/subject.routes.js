const express = require("express");
const router = express.Router();
const SubjectController = require("../controllers/subject.controller");

router.get("/", SubjectController.index);
router.get("/:id", SubjectController.show);
router.post("/", SubjectController.store);
router.put("/:id", SubjectController.update);
router.delete("/:id", SubjectController.destroy);

module.exports = router;
