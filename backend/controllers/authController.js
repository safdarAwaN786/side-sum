const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/encryption");
const { signToken } = require("../utils/token");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

module.exports = {
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password should be at least 8 characters long and contain an uppercase letter, a lowercase letter and a number.",
        });
      }
      const hashedPassword = await hashPassword(password);

      const newUser = new userModel({ ...req.body, password: hashedPassword });
      await newUser.save();

      // Generate JWT token with the user ID as payload
      const token = signToken({ userId: newUser._id });

      res.status(200).json({
        message: "Sign Up successful",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.log(error);

      // Check if it's a Mongoose validation error
      if (error.name === "ValidationError") {
        // Send the validation error messages
        const errors = Object.values(error.errors).map(
          (error) => error.message
        );
        return res.status(400).json({ message: "Validation error", errors });
      }

      // Check for duplicate key error (e.g., duplicate email)
      if (error.code === 11000) {
        // Find the duplicated field (usually 'email')
        const duplicatedField = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          message: `The ${duplicatedField} is already in use. Please use a different one.`,
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and Password are required!" });
      }

      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Generate JWT token with the user ID as payload
      const token = signToken({ userId: user._id });

      // Send token in the response
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = req.user;
      // Send token in the response
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
