const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const subjectRoutes = require("./subject.routes");

router.use("/user", userRoutes);
router.use("/subjects", subjectRoutes);

router.use("/", (req, res) => {
  res.json("Route not found");
});

module.exports = router;
