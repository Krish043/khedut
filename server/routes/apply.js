const express = require('express');
const { User } = require('../models/user.js'); // Assuming the User model is in this location
const mongoose = require('mongoose');
const Scheme = require('../models/scheme.js');
const router = express.Router();

router.post('/', async (req, res) => {
  const { mail, schemeId } = req.body;
  //  console.log('mail:', mail);
  // console.log('schemeId:', schemeId);

  if (!schemeId || !mail) {
    return res.status(400).send('Email and Scheme ID are required');
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).send('Invalid Scheme ID');
    }

    const user = await User.findOne({ email: mail });
    if (!user) return res.status(404).send('User not found');

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).send('Scheme not found');

    const alreadyApplied = user.appliedSchemes.find(
      (entry) => entry.scheme.toString() === schemeId
    );

    if (!alreadyApplied) {
      user.appliedSchemes.push({ scheme: schemeId, status: 'pending' });
      await user.save();
      return res.send({ message: 'Scheme applied successfully', appliedSchemes: user.appliedSchemes });
    } else {
      return res.send({ message: 'Scheme already applied', appliedSchemes: user.appliedSchemes });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
