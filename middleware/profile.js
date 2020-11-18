const Profile = require('../models/Profile');
const ApiError = require('../error/ApiError');

/* Middleware function that can be attached to a route to find and 
   attach a user's profile (by user id), if it exists, to the request 
   object. */

const findProfile = async (req, res, next) => {
  const msg = 'Profile not found';
  try {
    // The user id is provided via the request params or the request body
    const user_id = req.params.user_id || req.user.id;
    const profile = await Profile.findOne({ user: user_id }).populate('user', [
      'name',
    ]);
    if (!profile) {
      next(ApiError.notFound(msg));
      return;
    }
    req.profile = profile;
    next();
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(ApiError.notFound(msg));
      return;
    }
    next(err);
  }
};

module.exports = findProfile;
