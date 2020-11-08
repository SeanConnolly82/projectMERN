const express = require('express');
//const config = require('config');
const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const findBook = require('../middleware/book');
const findProfile = require('../middleware/profile');
const ApiError = require('../error/ApiError');

const profileRouter = express.Router();

const getBookIndex = (arrBooks, bookId) => {
  return arrBooks.map((item) => item._id).indexOf(bookId);
};

// @ route    POST /profile
// @ desc     Create a profile
// @ access   Private

profileRouter.post(
  '/',
  [
    auth,
    [
      check('about', 'Please enter something about yourself!').not().isEmpty(),
      check('favouriteAuthor', 'Please enter your favourite author!')
        .not()
        .isEmpty(),
      check('favouriteGenre', 'Please enter your favourite genre!')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { about, favouriteAuthor, favouriteGenre } = req.body;
    const user = req.user.id;

    const profileFields = {
      user,
      about,
      favouriteAuthor,
      favouriteGenre,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        next(ApiError.badRequest("Profile already exists"));
        return;
      }
      // Create new
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

// @ route    PUT /profile
// @ desc     Update a profile
// @ access   Private

profileRouter.put(
  '/',
  [
    auth,
    findProfile,
    [
      (check('about', 'Please enter something about yourself!').not().isEmpty(),
      check('favouriteAuthor', 'Please enter your favourite author!')
        .not()
        .isEmpty(),
      check('favouriteGenre', 'Please enter your favourite genre!')
        .not()
        .isEmpty()),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { about, favouriteAuthor, favouriteGenre } = req.body;

    const profile = req.profile;

    profile.about = about;
    profile.favouriteAuthor = favouriteAuthor;
    profile.favouriteGenre = favouriteGenre;

    try {
      await profile.save();
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

// @ route    GET /profile/:user_id
// @ desc     Get a profile
// @ access   Public

profileRouter.get('/:user_id', findProfile, async (req, res, next) => {
  try {
    const profile = req.profile;
    if(profile.image) {
      res.json({ 
        profile: profile,
        image: profile.image.toString('base64')
      });
      return;
    }
    res.json(profile)
  } catch (err) {
    next(err);
  }
});

// @ route    PUT /profile/books/:book_id
// @ desc     Add book to profile
// @ access   Private

profileRouter.put(
  '/books/:book_id',
  [auth, findBook, findProfile],
  async (req, res, next) => {
    try {
      const book = req.book;
      const profile = req.profile;
      const bookIndex = getBookIndex(
        profile.booksCollection,
        req.params.book_id
      );

      if (bookIndex !== -1) {
        next(ApiError.badRequest('Book already added'));
        return;
      }
      profile.booksCollection.unshift(book);
      await profile.save();
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

// @ route    DELETE /profile/books/:book_id
// @ desc     Remove book from profile
// @ access   Private

profileRouter.delete(
  '/books/:book_id',
  [auth, findBook, findProfile],
  async (req, res, next) => {
    try {
      const profile = req.profile;
      const bookIndex = getBookIndex(
        profile.booksCollection,
        req.params.book_id
      );

      if (bookIndex !== -1) {
        profile.booksCollection.splice(bookIndex, 1);
      } else {
        next(ApiError.badRequest('Book not found in your collection!'));
        return;
      }
      await profile.save();
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

// @ route    PUT /profile/image-upload/:user_id
// @ desc     Upload a profile picture
// @ access   Private

profileRouter.put(
  '/image-upload/:user_id',
  [auth, findProfile],
  async (req, res, next) => {
    try {
      const profile = req.profile;
      const imageBuffer = new Buffer.from(req.body.file, 'base64');
      const imageFileType = req.body.fileType;

      profile.image = imageBuffer;
      profile.imageFileType = imageFileType;

      await profile.save();
      res.json({ msg: 'Upload sucessful' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = profileRouter;
