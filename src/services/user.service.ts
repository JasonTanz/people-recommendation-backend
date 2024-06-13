import { ServiceResponse } from '../@types/common';
import { TRecommendedUser } from '../@types/recommend';
import { TUser, TUserPayload } from '../@types/user';
import { logger } from '../config/logger';
import db from '../models';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';

const create = async (body: TUserPayload): Promise<ServiceResponse<TUser>> => {
  try {
    const user = await db.users.create(body);
    logger.info(`User created: ${user.name}`);
    return [null, user];
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    return [error, null];
  }
};

const getByName = async (name: string): Promise<ServiceResponse<TUser>> => {
  try {
    const user = await db.users.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
    return [null, user];
  } catch (error) {
    logger.error(`Error finding user: ${error}`);
    return [error, null];
  }
};

const queryBuilder = (history: string[]): string => {
  let whereClause = '';

  if (!isEmpty(history)) {
    whereClause = 'AND id NOT IN(:historyIds)';
  }

  return `
 WITH owner_data AS (
    SELECT university, interests
    FROM users
    WHERE id = :ownerId
),
pre_weighted_users AS (
    SELECT id, name, gender, location, university, interests,
        RANDOM() AS random_val,
        CASE 
            WHEN university = (SELECT university FROM owner_data) AND interests = (SELECT interests FROM owner_data)
            THEN 0.7
            WHEN university = (SELECT university FROM owner_data) OR interests = (SELECT interests FROM owner_data)
            THEN 0.2
            ELSE 0.1
        END AS weight_factor
    FROM users
    WHERE id != :ownerId
    ${whereClause}
),
weighted_users AS (
    SELECT id, name, gender, location, university, interests, weight_factor,
           random_val * weight_factor AS weight
    FROM pre_weighted_users
)
SELECT id, name, gender, location, university, interests, weight
FROM weighted_users
ORDER BY RANDOM() * (1 / weight_factor)
LIMIT 10;
  `;
};

const getSuggestion = async ({
  ownerId,
  history,
}: {
  ownerId: string;
  history: string[];
}): Promise<ServiceResponse<TRecommendedUser[]>> => {
  try {
    const query = queryBuilder(history);

    const suggestions = await db.sequelize.query(query, {
      replacements: { ownerId, historyIds: history },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return [null, suggestions];
  } catch (error) {
    return [error, null];
  }
};

export default { create, getByName, getSuggestion };
