const express = require('express');
const Product = require('../models/products');

const router = express.Router();

router.post('/', (req, res) => {
    const {email,productname,quantity,price,description,uri,rating,category} = req.body;

    const newProduct = new Product({
      email,
      productname,
      quantity,
      price,
      description,
      uri,
      category,
      rating
    });

    newProduct.save()
        .then(product => res.json(product))
        .catch(err => res.status(500).json({ error: 'Failed to add product' }));
});

router.get('/', (req, res) => {
    Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ error: 'Failed to retrieve products' }));
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


module.exports = router;
