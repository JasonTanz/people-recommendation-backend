import * as express from 'express';
import { authController } from '../controllers';
import { userMiddleware, authMiddleware } from '../middlewares';
const router = express.Router();

router.get('/', authMiddleware.ValidateJWT, authController.checkAuth);
router.post(
  '/signup',
  userMiddleware.validateUserAlreadyExists,
  authController.signup,
);
router.post('/login', authController.login);

export default router;
