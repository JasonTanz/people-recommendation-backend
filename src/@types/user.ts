export type TBaseUser = {
  id: string;
  name: string;
  gender: string;
  location: string;
  university: string;
  interests: string;
};
export type TUser = TBaseUser & {
  dataValues: {
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  validPassword?: (password: string) => boolean;
};

export type TUserPayload = Omit<TBaseUser, 'id'>;
