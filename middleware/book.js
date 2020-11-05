const Book = require('../models/Book');

const ApiError = require('../error/ApiError');

const findBook = async (req, res, next) => {
  const msg = 'Book not found';
  try {
    const book = await Book.findOne({ _id: req.params.book_id });
    if (!book) {
      next(ApiError.notFound(msg));
      return;
    }
    req.book = book;
    next();
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(ApiError.notFound(msg));
      return;
    }
    next(err);
  }
};

module.exports = findBook;
