const express = require("express");
const router = express.Router();
const accConnections = require("../controllers/shipAccountsController");

router.post("/fedex", accConnections.addFedex);

module.exports = router;
