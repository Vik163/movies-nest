import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/schemas/users.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
import { LocalStrategy } from './local.auth';
import { UsersModule } from 'src/users/users.module';
dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [LocalStrategy, AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
