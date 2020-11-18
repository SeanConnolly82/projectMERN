const jwt = require('jsonwebtoken');
const config = require('config');

const ApiError = require('../error/ApiError');

/* Middelware function to be attached to private routes to verify
   the JWT token attached as a header on the request object. If not
   verified, a 401 status respnse will be sent. */

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    next(new ApiError.notAuthorised("Not authorised"));
    return;
  }
  try { 
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    next(new ApiError.notAuthorised("Not authorised"));
  }
};

module.exports = auth;