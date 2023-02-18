import { Controller, Request, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserItem } from 'src/users/interfaces/user.interface';

@Controller()
export default class AuthController {
  usersServive: any;
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserItem> {
    return this.usersServive.createUser(createUserDto);
  }

  @Post('signin')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
