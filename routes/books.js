const express = require('express');
const { check, validationResult } = require('express-validator');

const Book = require('../models/Book');
//const User = require('../models/User');
const auth = require('../middleware/auth');
const findBook = require('../middleware/book');
const findProfile = require('../middleware/profile');
//const ApiError = require('../error/ApiError');

const bookRouter = express.Router();

// @ route    GET /library
// @ desc     Get all books
// @ access   Public

bookRouter.get('/library', async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// @ route    GET /library/:book
// @ desc     Get a specific book
// @ access   Public

bookRouter.get('/library/:book_id', findBook, async (req, res, next) => {
  try {
    const book = req.book;
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// @ route    POST /library/add
// @ desc     Add a new book to library
// @ access   Private

bookRouter.post(
  '/library/add',
  auth,
  [
    check('name', 'Please enter a name').not().isEmpty(),
    check('description', 'Please enter a description').not().isEmpty(),
    check('author', 'Please enter the author').not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, author, publisher, year } = req.body;

    try {
      const book = new Book({
        name,
        description,
        author,
        publisher,
        year,
      });
      await book.save();
      res.json(book);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = bookRouter;
