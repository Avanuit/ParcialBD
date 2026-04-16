const express = require("express");
const router = express.Router();
const talentDao = require("../dao/talent.dao");

router.post("/candidates", talentDao.registerCandidate);
router.get("/candidates/:id", talentDao.getCandidateById);

module.exports = router;