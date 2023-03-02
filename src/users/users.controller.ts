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
import { IIdUserRequest, IUserItem } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersServive: UsersService) {}

  //Получить пользователя --------------------------------------
  @UseGuards(JwtAuthGuard) // Проверка авторизации
  @Get()
  getUser(@Req() req: IIdUserRequest): Promise<IUserItem> {
    return this.usersServive.getUser(req.user._id);
  }

  //Обновить пользователя ---------------------------------------
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(UpdateUserSchema)) // Валидация
  @Patch()
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: IIdUserRequest,
  ): Promise<IUserItem> {
    return this.usersServive.updateUser(updateUserDto, req.user._id);
  }
}
