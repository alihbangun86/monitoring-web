const express = require("express");

const router = express.Router();

const {

    getServices,
    getServiceDetail,
    createService,
    deleteService,
    getServiceHistory

} = require("../controllers/serviceController");

router.get("/", getServices);

router.get("/:id", getServiceDetail);

router.get("/:id/history", getServiceHistory);

router.post("/", createService);

router.delete("/:id", deleteService);

module.exports = router;