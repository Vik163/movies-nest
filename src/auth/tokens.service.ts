import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  // Создаем токены ---------------------------------
  createTokens(payload) {
    const accessToken = `Bearer ${this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    })}`;

    const refreshToken = `Bearer ${this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    })}`;

    return { accessToken, refreshToken };
  }

  // Сохраняем токен в БД ---------------------------------
  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenModel.create({ user: userId, refreshToken });
    return token;
  }
}
