import * as JWT from 'jsonwebtoken';
import { logger } from '../config/logger';

export const ValidateJWT = (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  try {
    token = token.split(' ')[1];
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Token not found',
    });
  }

  if (!token) {
    return res.status(400).json({ status: false, message: 'Token required' });
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`JWT: ${err.message}`);
      return res
        .status(401)
        .json({ status: false, error: 'Token is not valid' });
    }
    req.decoded = decoded;
    next();
  });
};

export default {
  ValidateJWT,
};
