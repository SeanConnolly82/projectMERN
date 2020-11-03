const jwt = require('jsonwebtoken');
const config = require('config');

const ApiError = require('../error/ApiError');

const auth = (req, res, next) => {
  
  const token = req.header('x-auth-token');

  if (!token) {
    next(new ApiError(401, 'Not authorised'));
    return;
  }
  try { 
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user; 
    next();
  } catch (err) {
    next(new ApiError(401, err.message));
  }
};

module.exports = auth;