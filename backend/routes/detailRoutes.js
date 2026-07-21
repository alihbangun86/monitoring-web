const express = require("express");

const router = express.Router();

const detailController = require("../controllers/detailController");

router.get("/:id/details", detailController.getServiceDetail);

module.exports = router;