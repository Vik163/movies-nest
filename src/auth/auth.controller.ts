import {
  Controller,
  Post,
  Body,
  UsePipes,
  Res,
  Get,
  Param,
  UseFilters,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserSchema } from 'src/auth/dto/create-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { LoginUserDto, LoginUserSchema } from './dto/login-user.dto';
import { CreateUserType } from './interfaces/auth.interface';
import { ErrorFilter } from 'src/filters/errors.filter';

@Controller()
export default class AuthController {
  usersServive: any;
  constructor(private authService: AuthService) {}

  @UseFilters(new ErrorFilter())
  @UsePipes(new ValidationPipe(CreateUserSchema))
  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateUserType> {
    return this.authService.createUser(createUserDto, res);
  }

  @UsePipes(new ValidationPipe(LoginUserSchema))
  @Post('signin')
  @UseFilters(new ErrorFilter())
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }

  // Подтверждение аутентификации через почту яндекса ------------
  @Get('activate/:link')
  @UseFilters(new ErrorFilter())
  async activate(@Param('link') link: string, @Res() res: Response) {
    this.authService.activate(link);
    return res.status(302).redirect(process.env.CLIENT_URL);
  }

  @Get('logout')
  @UseFilters(new ErrorFilter())
  async logout(@Res() res: Response, @Req() req: Request) {
    return this.authService.logout(res, req);
  }
}
