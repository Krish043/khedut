const express = require('express');
const {User,validate} = require('../models/user');

const bcrypt = require("bcrypt");
const Joi = require("joi");

const router = express.Router();


router.post('/', async(req, res) => {    
    // const { email, password } = req.body;

    // // Find the user by email
    // User.findOne({ email: email })
    //     .then(data => {
    //         if (data) {
    //             // Check if the password matches
    //             if (data.password === password) {
    //                 res.json({
    //                     name: data.name,
    //                     role: data.role
    //                 });
    //             } else {
    //                 res.json('Wrong password');
    //             }
    //         } else {
    //             res.json("Invalid email or password");
    //         }
    //     })
    //     .catch(err => res.status(500).json(err));

    try {
		const { error } = validateSignin(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid email or password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid email or password" });

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully",name: user.name, email: user.email, role: user.role, img: user.img});
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}

});
const validateSignin = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
