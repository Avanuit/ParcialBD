const express = require("express");
const router = express.Router();
const jobsDao = require("../dao/jobs.dao");

router.post("/applications", jobsDao.applyToOffer);
router.get("/applications/:id", jobsDao.getApplicationStatus);
router.get("/offers", jobsDao.getAllOffers);

module.exports = router;