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
import { IMovies } from './interfaces/movies.interface';
import { IIdUserRequest } from 'src/users/interfaces/user.interface';
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
  @UseGuards(JwtAuthGuard) //Проверка авторизации
  @Get('movies')
  async getSaveMovies(): Promise<IMovies[]> | null {
    return this.moviesService.getSaveMovies();
  }

  //Сохраняем карту ----------------------------------
  @UsePipes(new ValidationPipe(CreateMovieSchema)) //Валидация
  @UseGuards(JwtAuthGuard)
  @Post('movies')
  async addCard(@Body() card: CreateMovieDto, @Req() req: IIdUserRequest) {
    return this.moviesService.addCard(card, req.user._id);
  }

  //Удалить карточку по id карты и id пользователя --------------
  @UseGuards(JwtAuthGuard)
  @Delete('movies/:id')
  async deleteCard(
    // Валидация id переданного в параметре -----------------------
    @Param('id', new ValidationPipe(DeleteMovieSchema)) id: string,
    @Req() req: IIdUserRequest,
  ): Promise<IMovies> {
    return this.moviesService.deleteCard(id, req.user._id);
  }
}
