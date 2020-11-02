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
  favouriteAuthor: {
    type: String,
    required: true
  },
  favouriteBook: {
    type: String,
    required: true
  },
  favouriteGenre: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);
