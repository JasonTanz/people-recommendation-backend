import * as joi from 'joi';
export const loginSchema = joi.object({
  name: joi.string().required().min(3),
  password: joi.string().required().min(8),
});

export const signupSchema = joi.object({
  name: joi.string().required().min(3),
  gender: joi.string().valid('Male', 'Female').required(),
  location: joi.string().required().min(5),
  university: joi
    .string()
    .valid(
      'Multimedia University',
      'TARUMT',
      'University Malaya',
      'Sunway University',
      'SEGi',
    )
    .required(),
  interests: joi
    .string()
    .required()
    .valid(
      'Football',
      'Piano',
      'Badminton',
      'Listen to Music',
      'Watch Movie',
      'Basketball',
    ),
  password: joi.string().required().min(8),
});

export default {
  loginSchema,
};
