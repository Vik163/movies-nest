import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';

export type TokenDocument = Document & Token;

@Schema()
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ required: true })
  refreshToken: string;
}

export const TokenShema = SchemaFactory.createForClass(Token);
