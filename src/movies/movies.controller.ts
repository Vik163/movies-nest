import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateMovieDto,
  CreateMovieSchema,
  DeleteMovieSchema,
} from './dto/create-movie.dto';
import { MoviesType } from './interfaces/movies.interface';
import { IdUserRequest } from 'src/users/interfaces/user.interface';
import { MoviesService } from './movies.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  //Получаем карточки -----------------------------
  @Get('beatfilm-movies')
  async findAll(): Promise<object[]> {
    return [];
  }

  //Получаем сохраненные карточки ----------------
  @UseGuards(JwtAuthGuard) //Защита авторизации
  @Get('movies')
  async getSaveMovies(): Promise<MoviesType[]> | null {
    return this.moviesService.getSaveMovies();
  }

  //Сохраняем карту ----------------------------------
  @UsePipes(new ValidationPipe(CreateMovieSchema))
  @UseGuards(JwtAuthGuard)
  @Post('movies')
  async addCard(@Body() card: CreateMovieDto, @Req() req: IdUserRequest) {
    return this.moviesService.addCard(card, req);
  }

  //Удаляем карту по id ----------------------------------
  @UseGuards(JwtAuthGuard)
  @Delete('movies/:id')
  async deleteCard(
    @Param('id', new ValidationPipe(DeleteMovieSchema)) id: string,
  ): Promise<MoviesType> {
    console.log('i');

    return this.moviesService.deleteCard(id);
  }
}
