import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from 'src/users/schemas/users.schema';
import { ICreateUser, IUser } from './interfaces/auth.interface';
import { TokensService } from './tokens.service';

@Injectable()
export class UtilsAuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokensService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<IUser> | null {
    // - Получаем пользователя ---
    const user: IUser = await this.userModel
      .findOne({ email })
      .select('+password');
    // if (!user) return null;
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }
    // - Сравниваем пароли ---
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new NotFoundException('Неверный пароль');
    }
    if (user && passwordValid) {
      // - Создаем данные пользователя с нужными полями ---
      const userPayload = {
        name: user.name,
        email: user.email,
        _id: user._id,
        isActivated: user.isActivated,
      };
      return userPayload;
    }
    return null;
  }

  // Отправляем данные пользователя -------------------------
  public async sendUserData(user: IUser, res: Response): Promise<ICreateUser> {
    //- Создаем токены ---
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

  // Подтверждение с запросом по ссылке 'activate/:link'  через почту яндекса ===
  async activate(activationLink: string): Promise<void> {
    // - Находим пользователя по ссылке в БД ---
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
}
