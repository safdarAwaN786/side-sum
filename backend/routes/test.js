const express = require("express");
const router = express.Router();
const test = require("../controllers/test");

router.post("/test", test.test);

module.exports = router;
