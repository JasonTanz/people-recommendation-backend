import { userService } from '../services';
import { logger } from '../config/logger';
import { NextFunction, Request, Response } from 'express';

const validateUserAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [err, user] = await userService.getByName(req.body.name);
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      return res.status(500).json({
        status: false,
        message: 'DB Error',
        error: err,
      });
    }
    if (user) {
      return res.status(400).json({
        status: false,
        message: 'User already exists',
      });
    }
    next();
  } catch (error) {
    logger.error(`DB Error: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: 'DB Error',
      error,
    });
  }
};
export default { validateUserAlreadyExists };
