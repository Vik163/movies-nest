import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class BadRequestFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (error instanceof HttpException) {
      const status = error.getStatus();
      if (status == 404) {
        return response
          .status(status)
          .json({ statusCode: status, message: 'Страница не найдена' });
      }
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка сервера' });
  }
}
