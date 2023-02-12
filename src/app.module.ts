import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from 'nestjs-dotenv';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
