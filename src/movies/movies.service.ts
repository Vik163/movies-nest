import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Movies, MoviesDocument } from './schemas/movies.schema';
import { MoviesType } from './interfaces/movies.interface';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movies.name) private moviesModel: Model<MoviesDocument>,
  ) {}

  //Получить сохраненные карточки -------------------------
  async getSaveMovies(): Promise<MoviesType[]> {
    return await this.moviesModel.find();
  }

  //Сохранить карточку добавляя id пользователя ------------------------
  async addCard(card: CreateMovieDto, userId: string): Promise<MoviesType> {
    const cardSave = await this.moviesModel.create({
      ...card,
      owner: userId,
    });
    return cardSave;
  }

  //Удалить карточку по id карты и id пользователя --------------
  async deleteCard(id: string, userId: string): Promise<MoviesType> {
    const deleteCard = await this.moviesModel.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!deleteCard) {
      throw new HttpException(
        'Карточка или пользователь не найдены',
        HttpStatus.NOT_FOUND,
      );
    }
    return deleteCard;
  }
}
