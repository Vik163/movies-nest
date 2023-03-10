import * as Joi from 'joi';
import validator from 'validator';

export const CreateMovieSchema: any = Joi.object({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
  movieId: Joi.number().required(),
  image: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.error('Ошибка');
    }),

  trailerLink: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.error('Ошибка');
    }),
  thumbnail: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message({
        custom: 'Поле thumbnail заполнено некорректно',
      });
    }),
});

export const DeleteMovieSchema: any = Joi.string().hex().length(24);

export class CreateMovieDto {
  readonly country: string;
  readonly director: string;
  readonly duration: number;
  readonly year: string;
  readonly description: string;
  readonly image: string;
  readonly trailerLink: string;
  readonly thumbnail: string;
  readonly nameRU: string;
  readonly nameEN: string;
  readonly movieId: number;
}
