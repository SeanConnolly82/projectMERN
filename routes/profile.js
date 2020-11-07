const express = require('express');
//const config = require('config');
const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const Image = require('../models/Image');
const auth = require('../middleware/auth');
const findBook = require('../middleware/book');
const findProfile = require('../middleware/profile');
const ApiError = require('../error/ApiError');

const profileRouter = express.Router();

const getBookIndex = (arrBooks, bookId) => {
  return arrBooks.map((item) => item._id).indexOf(bookId);
};


// @ route    POST /edit
// @ desc     Create or update a profile
// @ access   Private

profileRouter.post(
  '/edit',
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

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.about = about;
    profileFields.favouriteAuthor = favouriteAuthor;
    profileFields.favouriteGenre = favouriteGenre;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Update existing
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
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

// @ route    GET /:user_id
// @ desc     Get a profile
// @ access   Public

profileRouter.get('/:user_id', findProfile, async (req, res, next) => {
  try {
    const profile = req.profile;
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @ route    PUT /add-book/:book_id
// @ desc     Add book to profile
// @ access   Private

profileRouter.put(
  '/add-book/:book_id',
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

// @ route    DELETE /remove-book/:book_id
// @ desc     Remove book from profile
// @ access   Private

profileRouter.delete(
  '/remove-book/:book_id',
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

// @ route    POST /profile/image/:id
// @ desc     Remove book from profile
// @ access   Public

profileRouter.get('/image/:id', async (req, res, next) => {
  try {
    const img = await Image.findOne({ _id: req.params.id });

    let data = img.image.toString('base64');
  
    if (!img) {
      next(ApiError.notFound('Not found'));
      return;
    }
    res.json(data);
  } catch (err) {
    next(err)
  }
})

// @ route    POST /profile/image-upload
// @ desc     Remove book from profile
// @ access   Public

// TODO: Make private

profileRouter.post('/image-upload', async (req, res, next) => {
  try {
    const imageBuffer = new Buffer.from(req.body.file, 'base64');
    // TODO: include filename and type
    const img = new Image({ image: imageBuffer });

    await img.save();

    res.json(img);
  } catch (err) {
    next(err)
  }
});

module.exports = profileRouter;
