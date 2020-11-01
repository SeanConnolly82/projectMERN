const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  isbn: {
    type: string,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Book = mongoose.model('Book', bookSchema);
