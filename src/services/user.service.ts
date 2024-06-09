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
    logger.error(`Error finding user: ${error.message}`);
    return [error, null];
  }
};

const queryBuilder = (history: string[]): string => {
  let whereClause = '';

  if (!isEmpty(history)) {
    whereClause = 'AND id NOT IN(:historyIds)';
  }

  const subqueries = [
    `(SELECT id, name, gender, location, university, interests, 1 AS priority
      FROM users
      WHERE id != :ownerId
      ${whereClause}
      AND (university = (SELECT university FROM users WHERE id = :ownerId) AND
      interests = (SELECT interests FROM users WHERE id = :ownerId))
      LIMIT 2)`,
    `(SELECT id, name, gender, location, university, interests, 2 AS priority
      FROM users
      WHERE id != :ownerId
      ${whereClause}
      AND (university = (SELECT university FROM users WHERE id = :ownerId) OR
      interests = (SELECT interests FROM users WHERE id = :ownerId))
      LIMIT 4)`,
    `(SELECT id, name, gender, location, university, interests, 3 AS priority
      FROM users
      WHERE id != :ownerId
      ${whereClause}
      AND (university != (SELECT university FROM users WHERE id = :ownerId) AND
      interests != (SELECT interests FROM users WHERE id = :ownerId))
      LIMIT 10)`,
  ];

  return `
    SELECT id, name, gender, location, university, interests, priority
    FROM (${subqueries.join(' UNION ALL ')}) AS subquery
    ORDER BY priority
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
