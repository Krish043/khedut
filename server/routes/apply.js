const express = require('express');
const { User } = require('../models/user.js'); // Assuming the User model is in this location
const mongoose = require('mongoose');
const Scheme = require('../models/scheme.js');
const router = express.Router();


router.post('/', async (req, res) => {
  const { mail, schemeId } = req.body;
  // console.log("hey ");
  
  // console.log(mail);
  

  if (!schemeId || !mail) {
    return res.status(400).send('Email and Scheme ID are required');
  }

  try {
    // Ensure schemeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).send('Invalid Scheme ID');
    }

    // Find the user by email
    const user = await User.findOne({ email: mail });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).send('Scheme not found');
    }

    // Add the schemeId to the appliedSchemes array if it's not already there
    if (!user.appliedSchemes.includes(schemeId)) {
      user.appliedSchemes.push(schemeId);
      await user.save();
      res.send({ message: 'Scheme applied successfully', appliedSchemes: user.appliedSchemes });
    }else{
      res.send({ message: 'Scheme already applied', appliedSchemes: user.appliedSchemes });
      
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
