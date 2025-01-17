const express = require('express');
const router = express.Router();
const Scheme = require('../models/scheme');

// Endpoint to fetch schemes based on user role
router.get('/', async (req, res) => {
  const { role } = req.query; // Retrieve the user's role from query parameters

  try {
    // If a role is provided, filter schemes based on the targetAudience field
    const filter = role ? { targetAudience: role } : {};
    const schemes = await Scheme.find(filter);
    res.status(200).json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Error fetching schemes' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params; // Retrieve the scheme ID from URL parameters

  try {
    // Find the scheme by its ID
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json(scheme);
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ message: 'Error fetching scheme' });
  }
});

module.exports = router;
