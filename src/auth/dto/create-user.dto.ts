import * as Joi from 'joi';
import validator from 'validator';

export const CreateUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message({ custom: 'Поле email заполнено некорректно' });
    }),
  password: Joi.string().alphanum().required().min(6),
});

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.password = model.password;
  }
}
