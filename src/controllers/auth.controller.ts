import { authService, userService } from '../services';
import { loginSchema, signupSchema } from '../schema';
import { logger } from '../config/logger';
import { Request, Response } from 'express';

const checkAuth = async (req, res): Promise<Response> => {
  return res.status(204).json({
    status: true,
    message: 'Authenticated',
  });
};

const signup = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req || {};
  const { error, value } = signupSchema.validate(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [err, user] = await userService.create(value);
    if (err) {
      logger.error(`Error creating user: ${err.message}`);
      return res.status(400).json({
        status: false,
        message: 'Error creating user',
      });
    }
    if (user) {
      logger.info(`User created: ${user.name}`);
      delete user.dataValues.password;
      const token = await authService.getAccessToken(user);
      return res.status(201).json({
        status: true,
        message: 'User created',
        data: user,
        accessToken: token,
      });
    }
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: 'Error creating user',
    });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req || {};

  const { error, value } = loginSchema.validate(body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [err, user] = await userService.getByName(value.name);
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Error logging in the user',
        error: err,
      });
    }
    if (user) {
      const match = user.validPassword(value.password);
      delete user.dataValues.password;
      if (match) {
        const token = await authService.getAccessToken(user);

        return res.status(200).json({
          data: user,
          accessToken: token,
        });
      }
      return res.status(401).json({
        message: 'Invalid credential',
      });
    }

    logger.info(`User not found: ${value.name}`);
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    logger.error(`Error logging in: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: 'Error logging in',
    });
  }
};

export default { checkAuth, signup, login };
