const Book = require('../models/Book');

const ApiError = require('../error/ApiError');

/* Middleware function that can be attached to a route to find 
   and attach a book object (by book id), if it exists, to the 
   request object. */

const findBook = async (req, res, next) => {
  const msg = 'Book not found';
  // The book id is provided via the request params or the request body
  const book_id = req.body.book || req.params.book_id;
  try {
    const book = await Book.findOne({ _id: book_id });
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
