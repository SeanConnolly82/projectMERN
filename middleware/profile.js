const Profile = require('../models/Profile');

const findProfile = async (req, res, next) => {
  try {
    const user_id = req.params.user_id || req.user.id;
    const profile = await Profile.findOne({ user: user_id });
    if (!profile) {
      next(ApiError.badRequest("Profile not found"));
      return;
    }
    req.profile = profile;
    next();
  } catch(err) {
    next(err);
  }
};

module.exports = findProfile;