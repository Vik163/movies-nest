import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Movies, MoviesDocument } from './schemas/movies.schema';
import { MoviesType } from './interfaces/movies.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { IdUserRequest } from 'src/users/interfaces/user.interface';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movies.name) private moviesModel: Model<MoviesDocument>,
  ) {}

  async getSaveMovies(): Promise<MoviesType[]> {
    return await this.moviesModel.find();
  }

  async addCard(card: CreateMovieDto, req: IdUserRequest): Promise<MoviesType> {
    const cardSave = await this.moviesModel.create({
      ...card,
      owner: req.user._id,
    });
    return cardSave;
  }

  async deleteCard(id: string): Promise<MoviesType> {
    return await this.moviesModel.findByIdAndDelete(id);
  }
}
