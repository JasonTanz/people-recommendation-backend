import { authService, userService } from '../services';
import { logger } from '../config/logger';

const checkAuth = async (req, res) => {
  return res.status(204).json({
    status: true,
    message: 'Authenticated',
  });
};

// TODO express validation
const signup = async (req, res) => {
  try {
    const [err, user] = await userService.create(req.body);
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

const login = async (req, res) => {
  const { body } = req || {};
  try {
    const [err, user] = await userService.getByName(body.name);
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'error logging in the user',
        error: err,
      });
    }
    if (user) {
      const match = user.validPassword(body.password);
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

    logger.info(`User not found: ${body.name}`);
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
