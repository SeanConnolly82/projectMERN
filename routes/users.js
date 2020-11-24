const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Profile = require('../models/Profile');
const ApiError = require('../error/ApiError');

const auth = require('../middleware/auth');

const userRouter = express.Router();

// get a JWT token for user authentication
const getJwtToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 });
};

// @ route    POST /users/login
// @ desc     Login as a new user
// @ access   Public

userRouter.post(
  '/login',
  [
    // validation checks
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    // check for errors in the validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        next(ApiError.notAuthorised('Invalid Credentials'));
        return;
      }

      let token = getJwtToken(user);
      // respponse object includes the user id and auth token
      res.json({ user: user.id, token: token });
    } catch (err) {
      next(err);
    }
  }
);

// @ route    POST /users/register
// @ desc     Register as a new user
// @ access   Public

userRouter.post(
  '/register',
  [
    // validation checks
    check('name', 'Please enter a username').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    // check for errors in the validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        next(ApiError.badRequest('Email already in use'));
        return;
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let token = getJwtToken(user);
      // respponse object includes the user id and auth token
      res.json({ user: user.id, token: token });
    } catch (err) {
      next(err);
    }
  }
);

// @ route    DELETE /users/remove-user/:user_id
// @ desc     Remove a user (and associated profile)
// @ access   Private

userRouter.delete('/remove-user/:user_id', [auth], async (req, res, next) => {
  try {
    // delete user and profile from db
    await User.findOneAndDelete({ _id: req.params.user_id });
    await Profile.findOneAndDelete({ user: req.params.user_id });
    res.json({ msg: 'User and profile deleted' });
  } catch (err) {
    next(err);
  }
});

// @ route    PUT /users/change-password
// @ desc     Change password
// @ access   Private

userRouter.put(
  '/change-password',
  [
    auth,
    [
      // validation checks
      check('password', 'Please enter your current password').not().isEmpty(),
      check(
        'newPassword',
        'Please enter a new password with 6 or more characters'
      ).isLength({ min: 6 }),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    // check for errors in the validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      
      const user = await User.findOne({ _id: req.user.id });
      const currentPassword = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

      if (!(await bcrypt.compare(currentPassword, user.password))) {
        next(ApiError.notAuthorised('Invalid Password'));
        return;
      }
      // update password
      await User.findOneAndUpdate(
        { _id: user.id },
        { $set: { password: hashedNewPassword } }
      );
      res.json({ msg: 'Password changed' });
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  }
);

module.exports = userRouter;
