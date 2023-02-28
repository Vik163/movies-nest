import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as uuid from 'uuid';

import { User, UserDocument } from 'src/users/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokensService } from './tokens.service';
import { ICreateUser, IUser } from './interfaces/auth.interface';
import { MailService } from './mail.service';
import { UtilsAuthService } from './utils-auth.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private utilsAuthService: UtilsAuthService,
    private tokenService: TokensService,
    private mailService: MailService,
  ) {}

  // Регитрация =======================================================
  public async createUser(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<ICreateUser> {
    // - Проверяем на конфликт email ---
    const { email } = createUserDto;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new ConflictException(`Пользователь с ${email} уже существует`);
    }
    // - Хешируем пароль ---
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // - Запрос аутентификации через почту яндекса ---
    const activationLink = uuid.v4(); // - ссылка для параметра ---
    await this.mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/activate/${activationLink}`,
    );

    // - Записываем пользователя в БД и получаем его ---
    const user: IUser = await new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      activationLink,
    }).save();

    // - Создаем данные пользователя с нужными полями и отправляем ---
    const userPayload = user && {
      name: user.name,
      email: user.email,
      _id: user._id,
      isActivated: user.isActivated,
    };
    return await this.utilsAuthService.sendUserData(userPayload, res);
  }

  // Аутентификация ======================================================
  public async login(user: LoginUserDto, res: Response): Promise<ICreateUser> {
    try {
      // - Проверяем данные пользователя ---
      const payload: IUser = await this.utilsAuthService.validateUser(
        user.email,
        user.password,
      );

      if (payload) {
        // - Отправляем данные пользователя ---
        return await this.utilsAuthService.sendUserData(payload, res);
      }
    } catch (e) {
      throw new InternalServerErrorException('Ошибка сервера');
    }
  }

  // Обновление токенов ===========================================
  async refresh(req: Request): Promise<ICreateUser> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    // - Получаем данные из токена ---
    const payload = await this.tokenService.validateRefreshToken(refreshToken);
    // - Проверяем токен в БД ---
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!payload || !tokenFromDb) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    // - Получаем данные пользователя с возможными изменениями ---
    const user: IUser = await this.userModel.findById(payload._id);
    const userPayload = user && {
      name: user.name,
      email: user.email,
      _id: user._id,
      isActivated: user.isActivated,
    };
    // - Создаем токены ---
    const tokens = await this.tokenService.createTokens(userPayload);
    return { ...tokens, user: userPayload };
  }

  public async logout(res: Response, req: Request): Promise<void> {
    const { refreshToken } = req.cookies;
    const token = await this.tokenService.removeToken(refreshToken);
    res.clearCookie('refreshToken');
    res.json(token);
  }
}
