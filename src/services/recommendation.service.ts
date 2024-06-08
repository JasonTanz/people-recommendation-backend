import db from '../models';
import logger from '../config/logger';
import { Op } from 'sequelize';
export const bulkInsert = async (body) => {
  try {
    const recommendation = await db.recommendations.bulkCreate(body);
    logger.info(`Recommendations created`);
    return [null, recommendation];
  } catch (error) {
    logger.error(`Error creating recommendations: ${error.message}`);
    return [error, null];
  }
};

export const getByUserId = async (userId: string) => {
  try {
    const recommendations = await db.recommendations.findAll({
      where: { userId },
      attributes: ['recommendedUserId'],
    });
    logger.info(`Recommendations found for user ${userId}`);
    return [null, recommendations];
  } catch (error) {
    logger.error(
      `Error finding recommendations for user ${userId}: ${error.message}`,
    );
    return [error, null];
  }
};

export const checkRecommendationLimit = async ({ userId, today, tomorrow }) => {
  try {
    const recommendations = await db.recommendations.findAndCountAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: tomorrow.toDate(),
          [Op.lt]: today.toDate(),
        },
        // createdAt: {
        //   [Op.gte]: today,
        //   [Op.lt]: tomorrow,
        // },
      },
      include: [
        {
          model: db.users,
          as: 'recommendedUser',
          attributes: ['name', 'gender', 'location', 'university', 'interests'],
        },
      ],
    });
    logger.info(`Recommendations found`);
    return [null, recommendations];
  } catch (error) {
    logger.error(`Error finding recommendations: ${error.message}`);
    return [error, null];
  }
};
export default { getByUserId, bulkInsert, checkRecommendationLimit };
