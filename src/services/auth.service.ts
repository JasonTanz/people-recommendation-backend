import * as JWT from 'jsonwebtoken';

const getAccessToken = async (user) => {
  const expiry = '1h';
  const token = JWT.sign({ user, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });

  return token;
};

export default {
  getAccessToken,
};
