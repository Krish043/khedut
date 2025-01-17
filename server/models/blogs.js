const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: {
    type: String,// Reference to the User model
    required: true,
  }, // Reference to the User who created the blog
  role: {
    type: String,
    enum: ["farmer", "businessman"], // Role of the author
    required: true,
  },
  image: { 
    type: String 
  }, // Optional image for the blog
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
