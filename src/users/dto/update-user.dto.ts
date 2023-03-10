import * as Joi from 'joi';
import validator from 'validator';

export const UpdateUserSchema: any = Joi.object({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.error('Ошибка');
    }),
});

export class UpdateUserDto {
  readonly name: string;
  readonly email: string;
}
