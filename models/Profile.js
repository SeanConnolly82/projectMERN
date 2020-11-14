const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  about: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
  },
  imageFileType: {
    type: String
  },
  favouriteBook: {
    type: String,
    required: true
  },
  favouriteAuthor: {
    type: String,
    required: true
  },
  favouriteGenre: {
    type: String,
    required: true
  },
  booksCollection: [{ type: Object }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);
