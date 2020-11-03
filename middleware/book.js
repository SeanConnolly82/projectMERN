const Book = require('../models/Book');

const findBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.book_id });
    if (!book) {
      next(ApiError.badRequest('Book not found'));
      return;
    }
    req.book = book;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = findBook;
