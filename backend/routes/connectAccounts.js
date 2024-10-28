const express = require("express");
const router = express.Router();
const accConnections = require("../controllers/shipAccountsController");
const { checkUserByToken } = require("../middleware/authMiddleware");

router.post("/fedex",  checkUserByToken, accConnections.connectFedex);

module.exports = router;
