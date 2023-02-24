import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
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

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserType> | null {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  public async createUser(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<CreateUserType> {
    // - Проверяем на конфликт email ---
    const { email } = createUserDto;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new Error(`Пользователь с ${email} уже существует`);
    }
    // - Хешируем пароль ---
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Подтверждение аутентификации через почту яндекса ------------
    const activationLink = uuid.v4(); // Ссылка для параметра
    await this.mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/activate/${activationLink}`,
    );

    // - Записываем пользователя в БД и получаем его ---
    await new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      activationLink,
    }).save();
    const user = await this.userModel.findOne({ email });

    // - Создаем токены с записанным payload ---
    const payload = user && {
      email: user.email,
      id: user._id,
      name: user.name,
    };
    const tokens = this.tokenService.createTokens(payload);

    // - Сохраняем refreshToken в cookie ---
    const tokenRefresh = tokens.refreshToken;
    res.cookie('jwt', tokenRefresh, {
      maxAge: 3600000 * 24 * 30,
      httpOnly: true,
    });

    // - Сохраняем refreshToken в БД ---
    await this.tokenService.saveToken(user._id, tokenRefresh);

    return { user, tokens };
  }

  async activate(activationLink) {
    const user = await this.userModel.findOne({ activationLink });
    if (!user) {
      console.log(activationLink);

      throw new Error('Некорректная активация ссылки');
    }
    user.isActivated = true;
    await user.save();
  }

  public async login(user: LoginUserDto, res: Response): Promise<object> {
    try {
      const payload = await this.validateUser(user.email, user.password);
      if (payload) {
        const token = `Bearer ${this.jwtService.sign({ _id: payload._id })}`;
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });

        return {
          // token: `Bearer ${this.jwtService.sign({ _id: payload._id })}`,
          user: {
            name: payload.name,
            email: payload.email,
            _id: payload._id,
          },
        };
      }
    } catch (e) {
      throw new InternalServerErrorException('Ошибка сервера');
    }
  }
}
