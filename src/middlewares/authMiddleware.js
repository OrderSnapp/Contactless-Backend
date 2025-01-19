const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return apiResponse(res, 401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return apiResponse(res, 401, 'Token has expired');
    }
    return apiResponse(res, 401, 'Invalid token');
  }
};


// check authorization by role
const authRoleMiddleware = (roles=[])=>{
    return (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return apiResponse(res, 401, 'Authorization header missing');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
          return apiResponse(res, 401, 'Token missing');
      }

      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;

          // Check if the user has any of the required roles
          if (roles.length && !decoded.roles.some(role => roles.includes(role))) {
            return apiResponse(res, 401, 'Token Unauthorized');
        }

          next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
              return apiResponse(res, 401, 'Token has expired');
          }
          return apiResponse(res, 401, 'Invalid token');
      }
  };
}

module.exports = {
  authMiddleware,
  authRoleMiddleware
};