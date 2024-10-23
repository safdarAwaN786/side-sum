const express = require("express");
const router = express.Router();
const accConnections = require("../controllers/connectAccount")


router.post("/connect/fedex", accConnections.connectFedex);

module.exports = router;
