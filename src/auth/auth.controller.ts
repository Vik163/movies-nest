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
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserSchema } from 'src/auth/dto/create-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { LoginUserDto, LoginUserSchema } from './dto/login-user.dto';
import {
  INewUser,
  RequestWithUser,
  ResponseWithUser,
} from './interfaces/auth.interface';
import { ErrorFilter } from 'src/filters/errors.filter';
import { UtilsAuthService } from './utils-auth.service';

@Controller()
export default class AuthController {
  usersServive: any;
  constructor(
    private authService: AuthService,
    private utilsAuthService: UtilsAuthService,
  ) {}

  @UseFilters(new ErrorFilter())
  @UsePipes(new ValidationPipe(CreateUserSchema))
  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ResponseWithUser,
  ): Promise<INewUser> {
    return this.authService.createUser(createUserDto, res);
  }

  @UsePipes(new ValidationPipe(LoginUserSchema))
  @Post('signin')
  @UseFilters(new ErrorFilter())
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: ResponseWithUser,
  ): Promise<INewUser> {
    return this.authService.login(loginUserDto, res);
  }

  // Получение токенов с сервера -----------
  @Get('token')
  async refresh(@Req() req: RequestWithUser): Promise<INewUser> {
    return this.authService.refresh(req);
  }

  // Подтверждение с запросом по ссылке 'activate/:link'  через почту яндекса ===
  @Get('activate/:link')
  @UseFilters(new ErrorFilter())
  async activate(
    @Param('link') link: string,
    @Res() res: Response,
  ): Promise<void> {
    this.utilsAuthService.activate(link);
    return res.status(302).redirect(process.env.CLIENT_URL);
  }

  @Get('logout')
  @UseFilters(new ErrorFilter())
  async logout(
    @Res() res: Response,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return this.authService.logout(res, req);
  }
}
