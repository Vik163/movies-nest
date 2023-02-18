import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isURL } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';

export type MoviesDocument = Document & Movies;

@Schema()
export class Movies {
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  director: string;
  @Prop({ required: true })
  duration: number;
  @Prop({ required: true })
  year: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  nameRU: string;
  @Prop({ required: true })
  nameEN: string;
  @Prop({
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  })
  image: string;
  @Prop({
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  })
  trailerLink: string;
  @Prop({
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  })
  thumbnail: string;
  @Prop({ required: true })
  movieId: number;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  owner: User;
}

export const MoviesSchema = SchemaFactory.createForClass(Movies);
