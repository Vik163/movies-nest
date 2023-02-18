import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from 'nestjs-dotenv';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
    }),
    UsersModule,
    AuthModule,
    MoviesModule,
  ],
})
export class AppModule {}
