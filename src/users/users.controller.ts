import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Query } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdUserRequest, UserItem } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersServive: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@Req() req: IdUserRequest): Promise<UserItem> {
    return this.usersServive.getUser(req);
  }
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: IdUserRequest) {
    return this.usersServive.updateUser(updateUserDto, req);
  }
}
