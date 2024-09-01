const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// Import routes and other files
const products = require("./data/Products");
const databaseSeeder = require("./databaseSeeder");
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 9000;

// Database connection
mongoose
  .connect(process.env.MONGOOSEDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/seed", databaseSeeder); // Database seeding route
app.use("/api/users", userRoute); // Routes for users
app.use("/api/products", productRoute); // Routes for products
app.use("/api/orders", orderRoute); // Routes for orders

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
