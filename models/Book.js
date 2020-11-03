const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String
  },
  year: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Book = mongoose.model('Book', bookSchema);
