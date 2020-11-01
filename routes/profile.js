const express = require('express');
const config = require('config');

const User = require('../models/Users');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const profileRouter = express.Router();

profileRouter.post(
  '/',
  [
    auth,
    [
      check('about', 'Insert a message').not().isEmpty(),
     // check('favouriteAuthors', 'Insert a message').not().isEmpty(),
     // check('favouriteBooks', 'Insert a message').not().isEmpty(),
     // check('genres', 'Insert a message').not().isEmpty(),
    ],
  ],
  async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      about,
      favouriteAuthors,
      favouriteBooks,
      genres
    } = req.body;

    //console.log(req.body);

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.about = about;
    profileFields.favouriteAuthors = favouriteAuthors;
    profileFields.favouriteBooks = favouriteBooks;
    profileFields.genres = genres;

    console.log(profileFields);

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Update existing
      
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );
        return res.json(profile);
      };

      // Create new
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

profileRouter.get('/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id });
    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = profileRouter;
