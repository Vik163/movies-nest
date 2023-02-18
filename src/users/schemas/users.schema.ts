import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
