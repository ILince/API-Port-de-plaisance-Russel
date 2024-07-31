const jwt = require("jsonwebtoken");

// Load environment variables from a .env file
require("dotenv").config();

// Get the secret key from environment variables
const { SECRET_KEY } = process.env;

// Check if the secret key is defined; if not, throw an error
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

/**
 * Middleware function to check if the JWT is valid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 * @throws {Error} Throws an error if the token is not valid or if verification fails.
 */
exports.checkJWT = (req, res, next) => {
  // Get the token from cookies
  const token = req.cookies.accessToken;

  // If there's no token, respond with an error
  if (!token) {
    return res.status(401).json({ error: "token_required" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    // Add the decoded data to the request object
    req.decoded = decoded;
    // Proceed to the next middleware
    next();
  } catch (error) {
    // If the token is not valid, respond with an error
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "token_not_valid" });
  }
};
