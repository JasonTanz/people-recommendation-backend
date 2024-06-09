import * as JWT from 'jsonwebtoken';
import { TUser } from '../@types/user';

const getAccessToken = (user: TUser): string => {
  const expiry = '1h';
  const token = JWT.sign({ user, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });

  return token;
};

export default {
  getAccessToken,
};
