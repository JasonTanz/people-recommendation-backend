import moment from 'moment';
import { recommendationService } from '../services';
import { logger } from '../config/logger';

const checkRecommendationLimit = async (req, res, next) => {
  try {
    // const today = moment().startOf('day');
    // const tomorrow = moment(today).add(1, 'day');

    const today = moment();
    const tomorrow = moment(today).subtract(5, 'seconds');

    console.log(today, tomorrow);

    // Count recommendations made today
    // TODO: use recommendation service
    const [err, result] = await recommendationService.checkRecommendationLimit({
      userId: req.decoded.user.id,
      today,
      tomorrow,
    });

    console.log('here--------------->', result.rows);
    if (err) {
      logger.error(`Error checking recommendation limit: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Check if the limit is exceeded
    if (result.count >= 10) {
      return res.status(200).json({
        message: 'Daily recommendation limit exceeded',
        newResult: false,
        data: result.rows.map((row) => ({
          ...row.recommendedUser?.dataValues,
          priority: row.priority,
        })),
      });
    }

    // If the limit is not exceeded, proceed to the next middleware
    next();
  } catch (error) {
    logger.error(`Error checking recommendation limit: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default { checkRecommendationLimit };
