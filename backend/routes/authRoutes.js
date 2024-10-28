const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);
// protected route that uses authMiddleware to proceed to controller function
router.get(
  "/get-user-by-token",
  authMiddleware.checkUserByToken,
  authController.getUser
);

module.exports = router;
