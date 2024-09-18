const express = require("express");
const userRoute = express.Router();
const AsyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../tokenGenerate");
const protect = require("../middleware/Auth"); // Middleware to protect routes

// Login route
userRoute.post(
  "/login",
  AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // Generate token for the user
        createdAt: user.createdAt,
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error("Invalid Email or Password");
    }
  })
);

// Register route
userRoute.post(
  "/",
  AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400); // Bad request
      throw new Error("User already exists");
    } else {
      const user = await User.create({
        name,
        email,
        password, // Password will be hashed in the User model's `pre` save middleware
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id), // Send back token
          createdAt: user.createdAt,
        });
      } else {
        res.status(400); // Bad request
        throw new Error("Invalid user data");
      }
    }
  })
);

// Get authenticated user profile
userRoute.get(
  "/profile",
  protect, // Middleware to ensure the user is authenticated
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // req.user is populated by the `protect` middleware

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404); // Not found
      throw new Error("User not found");
    }
  })
);

// Update user profile
userRoute.put(
  "/profile",
  protect, // Middleware to ensure the user is authenticated
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Get user by ID

    if (user) {
      user.name = req.body.name || user.name; // Update name if provided
      user.email = req.body.email || user.email; // Update email if provided

      if (req.body.password) {
        user.password = req.body.password; // Update password if provided (will be hashed in User model)
      }

      const updatedUser = await user.save(); // Save updated user

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id), // Generate new token after update
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404); // Not found
      throw new Error("User not found");
    }
  })
);

module.exports = userRoute;
