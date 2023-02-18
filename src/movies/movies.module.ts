import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movies, MoviesSchema } from './schemas/movies.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movies.name, schema: MoviesSchema }]),
    forwardRef(() => AuthModule), // Импорт защитника
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
