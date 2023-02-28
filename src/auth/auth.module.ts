import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/schemas/users.schema';
import { Token, TokenShema } from './schemas/token.schema';

import { AuthService } from './auth.service';
import AuthController from './auth.controller';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
import { UsersModule } from 'src/users/users.module';
import { TokensService } from './tokens.service';
import { MailService } from './mail.service';
import { UtilsAuthService } from './utils-auth.service';
dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule), // Убераем круговую зависимость
    JwtModule.register({
      secret: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenShema }]),
  ],
  providers: [
    AuthService,
    UsersService,
    TokensService,
    MailService,
    UtilsAuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, TokensService],
})
export class AuthModule {}
