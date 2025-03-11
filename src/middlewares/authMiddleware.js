const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiResponse(res, 401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
      return apiResponse(res, 401, 'Unauthorized');
  }

  if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return apiResponse(res, 500, 'Internal Server Error');
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('Decoded user:', decoded);
      next();
  } catch (err) {
      if (err.name === 'TokenExpiredError') {
          return apiResponse(res, 401, 'Token has expired');
      } else if (err.name === 'JsonWebTokenError') {
          return apiResponse(res, 401, 'Invalid token');
      } else {
          console.error('JWT verification error:', err);
          return apiResponse(res, 500, 'Internal Server Error');
      }
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