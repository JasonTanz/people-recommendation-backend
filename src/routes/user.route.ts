import * as express from 'express';
import { authMiddleware, recommendationMiddleware } from '../middlewares';
import { userController } from '../controllers';
const router = express.Router();

router.get(
  '/recommendation',
  authMiddleware.ValidateJWT,
  recommendationMiddleware.checkRecommendationLimit,
  userController.getRecommendations,
);

export default router;
