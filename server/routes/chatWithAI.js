// require('dotenv').config();
const express = require('express');
const Product = require('../models/products');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const router = express.Router();

router.post('/', async (req, res) => {
    const messages = req.body.message; // Store the received message

    async function run() {
        const prompt = messages + ' Respond to the following query in a concise JSON format: {"answer":"Your answer here."} Ensure the response is plain text, without unnecessary whitespace, bold text, or special formatting. Limit the answer to at most 100 words.';
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);
        res.send(text)
        }
    run();
});

module.exports = router;
