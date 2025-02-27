const express = require("express");
const { sendBugAPI } = require("../controllers/reportContorller");

const router = express.Router();

router.post("/bug", sendBugAPI);

module.exports = router;