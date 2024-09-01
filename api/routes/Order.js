const express = require("express");
const orderRoute = express.Router();
const protect = require("../middleware/Auth");
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const axios = require("axios");

// Create a new order
orderRoute.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethods,
      shippingPrice,
      taxPrice,
      totalPrice,
      price,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items found");
    }

    // Create and save the new order
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethods,
      shippingPrice,
      taxPrice,
      totalPrice,
      price,
      user: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  })
);

// Get order details by ID
orderRoute.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// Update order status for payment using Paystack
orderRoute.put(
  "/:id/payment",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order Not Found");
    }

    const { email, amount } = req.body; // Email and amount should come from the client

    if (!email || !amount) {
      res.status(400);
      throw new Error("Email and amount are required");
    }

    try {
      // Initiate a Paystack payment
      const paystackResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100, // Paystack expects amount in kobo
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = paystackResponse;

      if (data.status) { // Ensure we check for the correct success condition
        // Send the authorization URL to the client
        res.status(200).json({
          message: "Payment initiated successfully",
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        });
      } else {
        res.status(400).json({ error: "Payment initiation failed", details: data });
      }
    } catch (error) {
      console.error("Paystack Error:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Payment initiation failed", details: error.response ? error.response.data : error.message });
    }
  })
);

// Verify payment callback route from Paystack
// Verify payment callback route from Paystack
orderRoute.get(
  "/:id/verify-payment",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order Not Found");
    }

    const { reference } = req.query; // Paystack will provide a reference in the query

    if (!reference) {
      res.status(400);
      throw new Error("Payment reference is required");
    }

    try {
      // Verify payment with Paystack
      const verifyPaymentResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const { data: verificationData } = verifyPaymentResponse;

      if (verificationData.status) {
        const paymentStatus = verificationData.data.status;

        if (paymentStatus === "success") {
          // Payment is successful, update the order
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: verificationData.data.id,
            status: verificationData.data.status,
            update_time: verificationData.data.paid_at,
            email_address: verificationData.data.customer.email,
          };

          const updatedOrder = await order.save();
          res.status(200).json(updatedOrder);
        } else if (paymentStatus === "failed") {
          res.status(400).json({
            error: "Payment verification failed",
            details: "Payment failed. Please try again.",
          });
        } else if (paymentStatus === "ongoing") {
          res.status(200).json({
            message: "Payment is still in progress. Please complete the payment.",
            details: verificationData.data.gateway_response,
          });
        } else {
          res.status(400).json({
            error: "Payment is in an unknown state.",
            details: verificationData.data,
          });
        }
      } else {
        res.status(400).json({
          error: "Payment verification failed",
          details: verificationData,
        });
      }
    } catch (error) {
      console.error(
        "Paystack Verification Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        error: "Payment verification failed",
        details: error.response ? error.response.data : error.message,
      });
    }
  })
);


// Get list of orders for the user
orderRoute.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    if (orders && orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404);
      throw new Error("Orders Not Found");
    }
  })
);

module.exports = orderRoute;
