const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: Buffer
});

module.exports = Image = mongoose.model('Image', imageSchema);
