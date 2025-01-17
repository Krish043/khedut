const express = require('express');
const {User,validate} = require('../models/user');

const bcrypt = require("bcrypt");
const Joi = require("joi");

const router = express.Router();

router.post('/', async(req, res) => {
    // const { email, role } = req.body;

    // if (!['farmer', 'businessman'].includes(role)) {
    //     return res.status(400).json("Invalid role selected. Choose either 'farmer' or 'businessman'.");
    // }

    // User.findOne({ email: email })
    //     .then(data => {
    //         if (data && data.email === email) {
    //             res.json("The user already exists.");
    //         } else {
    //             User.create(req.body)
    //                 .then(user => res.json(user))
    //                 .catch(err => res.status(500).json(err));
    //         }
    //     })
    //     .catch(err => res.status(500).json(err));

    try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
