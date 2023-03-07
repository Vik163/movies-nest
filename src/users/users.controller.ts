import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { RequestWithIdUser, IUserItem } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersServive: UsersService) {}

  //Получить пользователя --------------------------------------
  @UseGuards(JwtAuthGuard) // Проверка авторизации
  @Get('users/me')
  getUser(@Req() req: RequestWithIdUser): Promise<IUserItem> {
    return this.usersServive.getUser(req.user._id);
  }

  //Обновить пользователя ---------------------------------------
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(UpdateUserSchema)) // Валидация
  @Patch('users/me')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithIdUser,
  ): Promise<IUserItem> {
    return this.usersServive.updateUser(updateUserDto, req.user._id);
  }
}
