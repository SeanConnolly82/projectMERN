const express = require('express');
const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const findBook = require('../middleware/book');
const findProfile = require('../middleware/profile');
const ApiError = require('../error/ApiError');

const profileRouter = express.Router();

// function to get the index of a particular book in the profile books collection
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
      // validation checks
      check('about', 'Please enter something about yourself!').not().isEmpty(),
      check('favouriteBook', 'Please enter your favourite book!')
        .not()
        .isEmpty(),
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
    // check for errors in the validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // get profile attributes from the request body
    const {
      about,
      favouriteBook,
      favouriteAuthor,
      favouriteGenre,
      image
    } = req.body;
    const user = req.user.id;

    // create profile object
    const profileFields = {
      user,
      about,
      favouriteBook,
      favouriteAuthor,
      favouriteGenre,
      image
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        next(ApiError.badRequest('Profile already exists'));
        return;
      }
      // save new profile to MongoDB
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

profileRouter.put('/', [auth, findProfile], async (req, res, next) => {
  // get profile attributes from the request body
  const {
    about,
    favouriteBook,
    favouriteAuthor,
    favouriteGenre,
    image,
  } = req.body;

  // get the existing saved profile
  const profile = req.profile;

  profile.user = profile.user.id;
  // update profile where new data has been provided in the request body
  profile.about = about ? about : profile.about;
  profile.favouriteBook = favouriteBook ? favouriteBook : profile.favouriteBook;
  profile.favouriteAuthor = favouriteAuthor
    ? favouriteAuthor
    : profile.favouriteAuthor;
  profile.favouriteGenre = favouriteGenre
    ? favouriteGenre
    : profile.favouriteGenre;
  profile.image.imageBase64 = image.imageBase64
    ? image.imageBase64
    : profile.image.imageBase64;
  profile.image.imageFileType = image.imageFileType
    ? image.imageFileType
    : profile.image.imageFileType;

  try {
    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @ route    GET /profile
// @ desc     Get a profile
// @ access   Private

profileRouter.get('/:user_id', [auth, findProfile], async (req, res, next) => {
  try {
    let profile = req.profile;
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

// @ route    PUT /profile/my-books
// @ desc     Add book to profile
// @ access   Private

profileRouter.put(
  '/my-books',
  [auth, findBook, findProfile],
  async (req, res, next) => {
    try {
      const book = req.book;
      const profile = req.profile;
      const bookIndex = getBookIndex(profile.booksCollection, req.body.book);

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

// @ route    DELETE /profile/my-books/:book_id
// @ desc     Remove book from profile
// @ access   Private

profileRouter.delete(
  '/my-books/:book_id',
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

// profileRouter.put(
//   '/image-upload/:user_id',
//   [auth, findProfile],
//   async (req, res, next) => {
//     try {
//       const profile = req.profile;
//       const imageBuffer = new Buffer.from(req.body.file, 'base64');
//       const imageFileType = req.body.fileType;
//       profile.image = imageBuffer;
//       profile.imageFileType = imageFileType;

//       await profile.save();
//       res.json({ msg: 'Upload sucessful' });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

module.exports = profileRouter;
