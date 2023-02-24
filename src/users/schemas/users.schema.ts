import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 2, maxlength: 30 })
  name: string;
  @Prop({
    required: true,
    unique: true,
  })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ default: false })
  isActivated: boolean;
  @Prop()
  activationLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
