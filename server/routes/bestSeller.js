const express = require('express');
const Product = require('../models/products');

const router = express.Router();

router.get('/', async (req, res) => {    
    try {
      const topProducts = await Product.find()
        .sort({ rating: -1 })  // Sort by rating in descending order
        .limit(10);             // Limit the results to 10
  
      res.status(200).json(topProducts);
    } catch (err) {
      console.error('Error fetching bestsellers:', err);
      res.status(500).json({ error: 'An error occurred while fetching bestsellers.' });
    }
    });

module.exports = router;
