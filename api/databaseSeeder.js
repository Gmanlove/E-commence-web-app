const router = require("express").Router();
const User = require("./models/User");
const users = require("./data/Users");
const Product = require("./models/Product");
const AsynHandler = require("express-async-handler");

// Route to seed users
router.post(
  "/users",
  AsynHandler(async (req, res) => {
    await User.deleteMany({});
    const UserSeeder = await User.insertMany(users);
    res.send({ UserSeeder });
  })
);

// Route to seed products
router.post(
  "/products",
  AsynHandler(async (req, res) => {
    await Product.deleteMany({});
    // Insert products from request body
    const ProductSeeder = await Product.insertMany(req.body);
    res.send({ ProductSeeder });
  })
);

module.exports = router;