const { loginToFedex } = require("../utils/connections");
const userModel = require("../models/userModel");
const { encrypt, decrypt } = require("../utils/encryption");

module.exports = {
  addFedex: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if username and password are provided
      if (!username || !password) {
        return res.status(400).json({
          message:
            "Please provide both username and password in the request body",
        });
      }

      // Find user by userId
      const user = req.user;

      // Check if the account with this username already exists
      const alreadyAddedAccount = user.addedAccounts.find(
        (acc) => acc.username === username
      );
      if (alreadyAddedAccount) {
        return res.status(400).json({
          message: "Account with this username already exists!",
        });
      }

      // Add new FedEx account details
      const accountDetails = {
        accountOf: "fedex",
        username,
        password: encrypt(password), // Encrypt the password before saving
        verified: false,
      };

      // Add the new account to the user's addedAccounts array
      user.addedAccounts.push(accountDetails); // Simpler push instead of array spread

      // Save the updated user
      await user.save();

      // Return success message
      res.status(200).json({ message: "Fedex Account Added" });
    } catch (error) {
      console.log("Error while adding FedEx account", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  connectFedex: async (req, res) => {
    try {
      const { username } = req.body; // Expecting userId and username from req.body

      if (!username) {
        return res.status(400).json({
          message: "Please provide username in request body",
        });
      }

      // Find the user by userId
      const user = req.user;

      // Check if the account is already added
      const alreadyAddedAccount = user.addedAccounts.find(
        (acc) => acc.username === username
      );

      if (!alreadyAddedAccount) {
        return res.status(400).json({
          message: "Account with this username not found.",
        });
      }

      // Decrypt the password
      const loginPassword = decrypt(alreadyAddedAccount.password);
      if (!loginPassword) {
        return res.status(400).json({
          message: "Password is required for the login attempt.",
        });
      }

      console.log("Login Password:", loginPassword);

      // Login to Fedex
      const loginResposne = await loginToFedex(username, loginPassword);
      console.log(loginResposne);

      // Update account verification status
      alreadyAddedAccount.verified = loginResposne.accVerified;

      // Save the updated user data
      await user.save();

      res.status(200).json({ message: "Fedex Account Verified" });
    } catch (error) {
      console.log("Error while connecting to Fedex:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
