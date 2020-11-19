const express = require('express');
const { check, validationResult } = require('express-validator');

const Book = require('../models/Book');
const auth = require('../middleware/auth');
const findBook = require('../middleware/book');
const findProfile = require('../middleware/profile');

const bookRouter = express.Router();

// @ route    GET /library
// @ desc     Get all books
// @ access   Public

bookRouter.get('/', async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// @ route    GET /library/search
// @ desc     Get all books for search critera (to be sent as a query param)
// @ access   Public

bookRouter.get('/search', async (req, res, next) => {
  let criteria = req.query.keyword;
  try {
    // search for the keyword in the name, author and description
    const books = await Book.find({
      $or: [
        { name: { $regex: criteria, $options: 'i' } },
        { author: { $regex: criteria, $options: 'i' } },
        { description: { $regex: criteria, $options: 'i' } },
      ],
    });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// @ route    POST /library
// @ desc     Add a new book to library
// @ access   Private

bookRouter.post(
  '/',
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
      let book = await Book.findOne({ name: name });
      if (book) {
        res.json({ msg: 'Book already exists in library' });
        return;
      }

      book = new Book({
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

// @ route    GET /library/:book_id
// @ desc     Get a specific book
// @ access   Public

bookRouter.get('/:book_id', findBook, async (req, res, next) => {
  try {
    const book = req.book;
    res.json(book);
  } catch (err) {
    next(err);
  }
});

module.exports = bookRouter;
