import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

// Ловим ошибки ====================================
@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): Response {
    const response = host.switchToHttp().getResponse();
    if (error instanceof HttpException) {
      const status = error.getStatus();
      const message = error.message;

      return response
        .status(status)
        .json({ statusCode: status, message: message });
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка сервера' });
  }
}
