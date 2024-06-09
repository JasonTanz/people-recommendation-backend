import { TBaseUser } from './user';

export type TRecommendedUser = TBaseUser & {
  priority: number;
};

export type TRecommendation = {
  userId: string;
  recommendedUserId: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TRecommendationPayload = {
  userId: string;
  recommendedUserId: string;
  priority: number;
};
