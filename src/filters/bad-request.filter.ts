import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

// Ловим ошибку неправильного адреса запроса ==============
@Catch()
export class BadRequestFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): Response {
    const response = host.switchToHttp().getResponse();
    if (error instanceof HttpException) {
      const status = error.getStatus();
      if (status == 404) {
        return response
          .status(status)
          .json({ statusCode: status, message: 'Страница не найдена' });
      }
      if (status == 401) {
        return response
          .status(status)
          .json({ statusCode: status, message: 'Пользователь не авторизован' });
      }
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка сервера' });
  }
}
