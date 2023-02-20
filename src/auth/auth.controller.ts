import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserSchema } from 'src/auth/dto/create-user.dto';
import { UserItem } from 'src/users/interfaces/user.interface';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { LoginUserDto, LoginUserSchema } from './dto/login-user.dto';

@Controller()
export default class AuthController {
  usersServive: any;
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe(CreateUserSchema))
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserItem> {
    return this.authService.createUser(createUserDto);
  }

  @UsePipes(new ValidationPipe(LoginUserSchema))
  @Post('signin')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
