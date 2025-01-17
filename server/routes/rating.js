const express = require('express');
const Product = require('../models/products');

const router = express.Router();

router.post('/', async (req, res) => {
    const { id, rating } = req.body;
    try {
      // const existingRating = await Product.findOne({ _id });
      const existingRating = await Product.findById(id);      
  
      if (existingRating) {
        // Update existing rating with the average
        const oldRating = existingRating.rating;
        const newRating = (oldRating + rating) / 2;
        existingRating.rating = newRating;
        await existingRating.save();
        res.json(existingRating);
      } 
      // else {
      //   // Create new rating
      //   const newRating = new Product({
      //     sellername,
      //     rating
      //   });
      //   await newRating.save();
      //   res.json(newRating);
      // }
    } 
    catch (err) {
      res.status(500).json({ error: 'Failed to add or update rating' });
    }
  });

module.exports = router;
