const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = {
  // Function to sign the token with a payload (like user ID)
  signToken: (payload) => {
    return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
  },

  // Function to verify if a token is valid
  verifyToken: (token) => {
    return jwt.verify(token, secret);
  },
};
