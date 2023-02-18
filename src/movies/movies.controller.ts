import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesInitialType, MoviesType } from './interfaces/movies.interface';
import { IdUserRequest } from 'src/users/interfaces/user.interface';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  //Получаем карточки -----------------------------
  @Get('beatfilm-movies')
  async findAll(): Promise<MoviesInitialType[]> {
    return [];
  }

  //Получаем сохраненные карточки ----------------
  @UseGuards(JwtAuthGuard) //Защита авторизации
  @Get('movies')
  getSaveMovies(): Promise<MoviesType[]> | null {
    return this.moviesService.getSaveMovies();
  }

  //Сохраняем карту ----------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('movies')
  addCard(@Body() card: CreateMovieDto, @Req() req: IdUserRequest) {
    return this.moviesService.addCard(card, req);
  }

  //Удаляем карту по id ----------------------------------
  @UseGuards(JwtAuthGuard)
  @Delete('movies/:id')
  deleteCard(@Param('id') id: string): Promise<MoviesType> {
    return this.moviesService.deleteCard(id);
  }
}
