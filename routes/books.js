const express = require('express');

const User = require('../models/Users')
const auth = require('../middleware/auth');

const bookRouter = express.Router();

bookRouter.get('/', auth, async (req, res) => {
  try {
    user = await User.findById(req.user.id);
    res.json(user);
  } catch(err) {
    res.status(500).send('Server error');
  }
});

module.exports = bookRouter;
