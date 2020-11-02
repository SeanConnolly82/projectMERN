const express = require('express');

const Book = require('../models/Book');
const User = require('../models/User');
const auth = require('../middleware/auth');

const bookRouter = express.Router();

bookRouter.post('/', auth, async (req, res) => {
  try {
    // Find all books
    const books = await User.findById(req.user.id);
    res.json(user);
  } catch(err) {
    res.status(500).send('Server error');
  }
});

// @route   GET books/library

bookRouter.get('/library', async (req, res) => {
  try {
    user = await User.findById(req.user.id);
    res.json(user);
  } catch(err) {
    res.status(500).send('Server error');
  }
});

module.exports = bookRouter;
