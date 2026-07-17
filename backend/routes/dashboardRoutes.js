const express = require("express");

const router = express.Router();

const {
  getSummary,
  getServiceStatus,
  getChart,
} = require("../controllers/dashboardController");

router.get("/summary", getSummary);

router.get("/services", getServiceStatus);

router.get("/chart", getChart);

module.exports = router;