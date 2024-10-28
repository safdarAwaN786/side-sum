const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const 

const algorithm = "aes-256-cbc";
// Store these securely in environment variables or configuration files
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, "salt", 32); // Derive key from a secret
const iv = Buffer.alloc(16, 0); // Initialize IV with zeros or use a constant IV (Not recommended for security reasons)

module.exports = {
  // Hash a password with bcrypt
  hashPassword: async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },

  // Compare a password with its hash
  comparePassword: async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  },

  // Encrypt text using AES-256-CBC
  encrypt: (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  },

  // Decrypt the encrypted text
  decrypt: (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
};

