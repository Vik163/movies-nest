import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const { error } = await this.schema.validate(value);
    if (error) {
      if (error.details[0].path[0]) {
        const message = `Поле '${error.details[0].path}' заполнено некорректно`;

        throw new ValidationException(message);
      } else {
        //ответ на ошибку id
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }
    }
    return value;
  }
}
