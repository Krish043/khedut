const express = require('express');
const Blog = require('../models/blogs');
const router = express.Router();
router.post('/', async (req, res) => {
  const { title, description, content, author, role, image } = req.body;
  // Basic validation (you might want to add more checks)
  if (!title || !description || !content || !author || !role) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  
  try {
    const newBlog = new Blog({
      title: req.body.title,
  description: req.body.description,
  image: req.body.image,
  content: req.body.content,
  author: req.body.author, 
  role: req.body.role      
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
// POST /blog/like/:id
router.post("/like/:id", async (req, res) => {
  const { userId } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (!blog) return res.status(404).json({ error: "Blog not found" });

  if (blog.likedBy.includes(userId)) {
    return res.status(400).json({ error: "User has already liked this blog" });
  }

  blog.likes += 1;
  blog.likedBy.push(userId);
  await blog.save();

  res.json({ message: "Liked successfully", likes: blog.likes });
});

// GET /user/:userId/most-liked
router.get("/users/:userId/most-liked", async (req, res) => {
  const userId = req.params.userId;

  const topBlog = await Blog.findOne({ author: userId })
    .sort({ likes: -1 })
    .limit(1);

  if (!topBlog) return res.status(404).json({ error: "No blogs found" });

  res.json(topBlog);
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

