const express = require("express");
const { executeMYSQL } = require("../controllers/executionController");

const router = express.Router();

router.post("/mysql", executeMYSQL);

module.exports = router;
