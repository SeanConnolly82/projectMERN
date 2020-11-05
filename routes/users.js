const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Profile = require('../models/Profile');
const ApiError = require('../error/ApiError');

const auth = require('../middleware/auth');
const findProfile = require('../middleware/profile');

const userRouter = express.Router();

const getJwtToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 });
};

// @ route    POST /register
// @ desc     Register as a new user
// @ access   Public

userRouter.post(
  '/register',
  [
    check('name', 'Please enter a username').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
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
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

// @ route    POST /login
// @ desc     Login as a new user
// @ access   Public

userRouter.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        next(ApiError.badRequest('Invalid Credentials'));
        return;
      }

      let token = getJwtToken(user);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

// @ route    DELETE /remove-account
// @ desc     Remove a user (and associated profile)
// @ access   Private

userRouter.delete(
  '/remove-account',
  [auth, findProfile],
  async (req, res, next) => {
    try {
      await User.findOneAndDelete({_id: req.user.id});
      await Profile.findOneAndDelete({user: req.user.id})
      res.json({msg: "User and profile deleted"})
    } catch(err) {
      next(err);
    }
  }
);

// @ route
// @ desc     Change password
// @ access   Private

// @ route
// @ desc     Reset password
// @ access   Public

module.exports = userRouter;
