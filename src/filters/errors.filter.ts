// import { HttpException, HttpStatus } from '@nestjs/common';

// export class ErrorException extends HttpException {
//   message: string;

//   static UnauthorizedException() {
//     return new ErrorException(
//       'Пользователь не авторизован',
//       HttpStatus.UNAUTHORIZED,
//     );
//   }

//   static BadRequestException(message: string) {
//     return new ErrorException(message, HttpStatus.BAD_REQUEST);
//   }
// }

import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
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
