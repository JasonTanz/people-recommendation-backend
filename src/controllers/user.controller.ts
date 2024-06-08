import logger from '../config/logger';
import { recommendationService, userService } from '../services';

const getRecommendations = async (req, res) => {
  const id = req.decoded.user.id;
  try {
    // todo get id only
    const [err, history] = await recommendationService.getByUserId(id);
    if (history) {
      const [err, suggestions] = await userService.getSuggestion({
        ownerId: id,
        history: history.map((h) => h.recommendedUserId),
      });
      if (suggestions) {
        console.log(suggestions);
        const ids = suggestions.map((suggestion) => ({
          userId: id,
          recommendedUserId: suggestion.id,
          priority: suggestion.priority,
        }));
        const [err, result] = await recommendationService.bulkInsert(ids);
        if (result) {
          return res.status(200).json({
            status: true,
            message: 'Recommendations found',
            data: suggestions,
            newResult: true,
          });
        }
        return res.status(500).json({
          status: false,
          message: `Error creating recommendations ${err}`,
        });
      }

      return res.status(500).json({
        status: false,
        message: `Error getting suggestion ${err}`,
      });
    }
    return res.status(500).json({
      status: false,
      message: `Error getting recommendations ${err}`,
    });
  } catch (error) {
    logger.error(`Error getting recommendations: ${error.message}`);
    return res.status(500).json({
      status: false,
      message: 'Error getting recommendations',
    });
  }
};

export default { getRecommendations };
