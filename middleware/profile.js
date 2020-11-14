const Profile = require('../models/Profile');

const ApiError = require('../error/ApiError');

const findProfile = async (req, res, next) => {
  const msg = 'Profile not found';
  try {
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
