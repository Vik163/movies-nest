import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserItem } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 2, maxlength: 30 })
  name: string;
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (v) => IsEmail(v),
      message: 'Неправильный формат почты',
    },
  })
  email: string;
  @Prop({ required: true, select: false })
  password: string;

  static findUserByCredentials = function (
    email: string,
    password: string,
  ): UserItem {
    return this.findOne({ email })
      .select('+password') // +password разрешает доступ к паролю
      .then((user) => {
        console.log('o');

        if (!user) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
      });
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email })
//     .select('+password') // +password разрешает доступ к паролю
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта или пароль'));
//       }

//       return bcrypt.compare(password, user.password).then((matched) => {
//         if (!matched) {
//           return Promise.reject(new Error('Неправильные почта или пароль'));
//         }

//         return user;
//       });
//     });
// };

// export { UserSchema };
