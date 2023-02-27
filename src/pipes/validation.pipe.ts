import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const { error } = await this.schema.validate(value);
    if (error) {
      if (error.details[0].path[0]) {
        const message = `Поле '${error.details[0].path}' заполнено некорректно`;

        throw new BadRequestException(message);
      } else {
        //ответ на ошибку id
        throw new BadRequestException('Плохой запрос');
      }
    }
    return value;
  }
}
