const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); // Adjust the path based on your project structure

// Route to fetch user data by email

router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      role: user.role,
      img: user.img,
    });
    // Or include email etc. if needed
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
// router.get('/email/:email', async (req, res) => {
//   try {
//     const userEmail = req.params.email; // Extract email from the request parameters

//     // Fetch user by email
//     const user = await User.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Return user details (excluding sensitive information like password)
//     res.json({
//       name: user.name,
//       id: user._id,
//       email: user.email,
//       role: user.role,
//       img: user.img,
//       appliedSchemes: user.appliedSchemes,
//       cart: user.cart
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get("/email/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Populate appliedSchemes.scheme reference
    const user = await User.findOne({ email: userEmail }).populate(
      "appliedSchemes.scheme"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      id: user._id,
      email: user.email,
      role: user.role,
      img: user.img,
      appliedSchemes: user.appliedSchemes,
      cart: user.cart,
      sales: user.productProfits,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
