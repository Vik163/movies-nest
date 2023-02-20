import * as Joi from 'joi';
import validator from 'validator';

export const LoginUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message({ custom: 'Поле email заполнено некорректно' });
    }),
  password: Joi.string().required().min(6).alphanum(),
});

export class LoginUserDto {
  readonly password: string;
  readonly email: string;
}
