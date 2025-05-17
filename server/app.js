require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bcrypt = require("bcrypt");
const Joi = require("joi");
const axios = require('axios');

app.use(express.json());
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri)

const signup = require('./routes/signup.js')
app.use('/signup', signup);

const signin = require('./routes/signin.js')
app.use('/signin', signin);

const chatWithAI = require('./routes/chatWithAI.js')
app.use('/messages', chatWithAI);

const product = require('./routes/product.js')
app.use('/products',product)

const rating = require('./routes/rating.js');
app.use('/ratings', rating);

const bestSellers = require('./routes/bestSeller.js');
app.use('/bestsellers', bestSellers);

const blogRoutes = require("./routes/blog.js");
app.use("/blog", blogRoutes);

const schemeRoutes = require('./routes/schemes.js');
app.use("/schemes", schemeRoutes);

const applyRoutes = require('./routes/apply.js');
app.use("/apply", applyRoutes);

const userRoutes = require('./routes/users.js');
app.use("/users", userRoutes);

const cartRoutes = require('./routes/cart.js');
app.use("/cart", cartRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
