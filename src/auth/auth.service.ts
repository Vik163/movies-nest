import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as uuid from 'uuid';

import { UsersService } from '../users/users.service';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokensService } from './tokens.service';
import { CreateUserType, UserType } from './interfaces/auth.interface';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private tokenService: TokensService,
    private mailService: MailService,
  ) {}

  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserType> | null {
    const user = await this.userModel.findOne({ email }).select('+password');
    // if (!user) return null;
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new NotFoundException('Неверный пароль');
    }
    if (user && passwordValid) {
      return {
        isActivated: user.isActivated,
        name: user.name,
        email: user.email,
        _id: user._id,
      };
    }
    return null;
  }

  // Отправляем данные пользователя -------------------------
  private async sendUserData(user, res) {
    const tokens = this.tokenService.createTokens(user);

    // - Сохраняем refreshToken в cookie ---
    const tokenRefresh = tokens.refreshToken;
    res.cookie('refreshToken', tokenRefresh, {
      maxAge: 3600000 * 24 * 30,
      httpOnly: true,
    });
    // - Сохраняем refreshToken в БД ---
    await this.tokenService.saveToken(user._id, tokenRefresh);
    const accessToken = tokens.accessToken;

    return { user, accessToken };
  }

  // Регитрация -----------------------------------------------
  public async createUser(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<CreateUserType> {
    // - Проверяем на конфликт email ---
    const { email } = createUserDto;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new ConflictException(`Пользователь с ${email} уже существует`);
    }
    // - Хешируем пароль ---
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // - Запрос аутентификации через почту яндекса ---
    const activationLink: string = uuid.v4(); // - ссылка для параметра ---
    // await this.mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/activate/${activationLink}`,
    // );

    // - Записываем пользователя в БД и получаем его ---
    const user = await new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      activationLink,
    }).save();

    // - Создаем токены с записанным payload ---
    const payload = user && {
      email: user.email,
      id: user._id,
      name: user.name,
    };
    // - Отправляем данные пользователя ---
    return await this.sendUserData(payload, res);
  }

  // Подтверждение активации по ссылке через почту ---------------
  async activate(activationLink) {
    const user = await this.userModel.findOne({ activationLink });
    if (!user) {
      throw new HttpException(
        'Некорректная активация ссылки',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true; // - меняем в БД флажок ---
    await user.save();
  }

  // Аутентификация -------------------------------------------------------
  public async login(user: LoginUserDto, res: Response): Promise<object> {
    try {
      // - Проверяем данные пользователя ---
      const payload = await this.validateUser(user.email, user.password);
      if (payload) {
        // - Отправляем данные пользователя ---
        return await this.sendUserData(payload, res);
      }
    } catch (e) {
      throw new InternalServerErrorException('Ошибка сервера');
    }
  }

  public async logout(res, req) {
    const { refreshToken } = req.cookies;
    const token = await this.tokenService.removeToken(refreshToken);
    res.clearCookie('refreshToken');
    res.json(token);
  }
}
