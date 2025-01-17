const express = require('express');
const Blog = require('../models/blogs');
const router = express.Router();
router.post('/', async (req, res) => {
  const { title, description, content, author, role, image } = req.body;
  // Basic validation (you might want to add more checks)
  if (!title || !description || !content || !author || !role) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  
  console.log(req.body);  
  try {
    const newBlog = new Blog({
      title,
      description,
      content,
      author,
      role,
      image
    });

    newBlog.save();
    
    res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ message: 'Error adding blog' });
  }
});
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find(); 
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Error deleting blog' });
  }
});


module.exports = router;

