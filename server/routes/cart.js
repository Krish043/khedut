const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const mongoose = require('mongoose');
const Product = require("../models/products"); 
const stripe = require("stripe")(process.env.STRIPE_SECRET)

// Endpoint to get product details by productId
router.post("/", async (req, res) => {
  const { mail, prodId } = req.body;

  if (!prodId || !mail) {
    return res.status(400).send("Email and product ID are required");
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(prodId)) {
      return res.status(400).send("Invalid product ID");
    }

    const user = await User.findOne({ email: mail });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const prod = await Product.findById(prodId);
    if (!prod) {
      return res.status(404).send("Product not found");
    }

    // Check if product already exists in cart
    const existingItem = user.cart.find(item => item.productId.toString() === prodId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId: prodId, quantity: 1 });
    }

    await user.save();

    res.send({
      message: "Product added/updated in cart successfully",
      cart: user.cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).populate("cart.productId");

    if (!user) return res.status(404).json({ message: "User not found" });

    const detailedCart = user.cart.map((item) => {
      const product = item.productId;
      const unitSize = product.quantity;      // e.g., 5kg per unit sold
      const count = item.quantity;            // e.g., 2 units added to cart

      return {
        _id: product._id,
        productname: product.productname,
        price: product.price,
        email: product.email,
        description: product.description,
        uri: product.uri,
        rating: product.rating,
        category: product.category,
        unitSize: unitSize,                   // 5 kg (or whatever is defined in product)
        count: count,                         // how many units added
        totalQuantity: unitSize * count,      // total quantity = 5 * 2 = 10kg
      };
    });

    res.json(detailedCart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find(); // Fetch all cart items
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details

    // Map product details to cart items
    const detailedCartItems = cartItems.map((cartItem) => {
      const product = products.find(
        (prod) => prod._id.toString() === cartItem.productId.toString()
      );
      return {
        ...product._doc, // Spread product details
        quantity: cartItem.quantity, // Include cart-specific info like quantity
      };
    });

    res.json(detailedCartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  // console.log(products)
  try {
    const lineItems = products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.productname,
          },
          unit_amount: Math.round((product.price*product.totalQuantity*100)/89.0053), // Stripe requires amount in cents
        },
        quantity: 1,
      }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/buy",
      cancel_url: "http://localhost:5173/cart",
    });
for (const product of products) {
      const productDoc = await Product.findById(product._id);
      if (!productDoc) continue;

      const revenue = product.price * product.totalQuantity;

      const farmer = await User.findOne({ email: productDoc.email });
      if (!farmer) continue;

      const profitEntry = farmer.productProfits.find(entry =>
        entry.productId.toString() === product._id
      );

      if (profitEntry) {
        profitEntry.totalProfit += revenue;
      } else {
        farmer.productProfits.push({
          productId: product._id,
          totalProfit: revenue,
        });
      }

      await farmer.save();
    }


    res.json({ id: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Route to reduce quantity (by baseQuantity unit, e.g., 1kg)
router.post("/remove", async (req, res) => {
  const { mail, prodId } = req.body;

  if (!prodId || !mail) {
    return res.status(400).send("Email and product ID are required");
  }

  try {
    const user = await User.findOne({ email: mail });
    if (!user) return res.status(404).send("User not found");

    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === prodId
    );

    if (itemIndex === -1) return res.status(404).send("Product not in cart");

    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      // If only 1 pack left, remove item from cart
      user.cart.splice(itemIndex, 1);
    }

    await user.save();

    res.send({
      message: "Product quantity reduced in cart successfully",
      cart: user.cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
