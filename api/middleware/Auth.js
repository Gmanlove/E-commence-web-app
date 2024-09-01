const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Corrected typo in environment variable
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user and exclude the password
      req.user = await User.findById(decodedToken.id).select("-password");

      // Continue to the next middleware/route handler
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, token failed" }); // Return a response when there is an error
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided!");
  }
});

module.exports = protect;
