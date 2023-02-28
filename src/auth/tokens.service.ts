import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { ITokens, IUser } from './interfaces/auth.interface';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  // Создаем токены ================================
  createTokens(payload: IUser): ITokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  // Проверка accessToken ===========================
  validateAccessToken(token: string): IUser {
    try {
      // - Получаем данные из токена ---
      const userData = <IUser>jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null; // - Не выбрасываем ошибку ---
    }
  }
  // Проверка refreshToken ===========================
  validateRefreshToken(token: string): IUser {
    try {
      const userData = <IUser>jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      return userData;
    } catch (e) {
      return null;
    }
  }

  // Сохраняем токен в БД ==========================================
  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    // - Проверка наличия токена ---
    const tokenData = await this.tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    // - Если отсутствует, то создаем ---
    const token = await this.tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string): Promise<object> {
    const tokenData = await this.tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  // Находим токен в БД ============================================
  async findToken(refreshToken: string): Promise<object> {
    const tokenData = await this.tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}
