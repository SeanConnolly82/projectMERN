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
    type: Buffer
  },
  favouriteAuthors: {
    type: String,
    required: true
  },
  favouriteBooks: {
    type: String,
    required: true
  },
  genres: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);
