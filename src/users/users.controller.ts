import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserItem } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersServive: UsersService) {}
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserItem> {
    return this.usersServive.createUser(createUserDto);
  }
}
