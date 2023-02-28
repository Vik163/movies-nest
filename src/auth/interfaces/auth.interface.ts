import { Types } from 'mongoose';

export interface IUser {
  readonly name: string;
  readonly email: string;
  readonly _id: Types.ObjectId;
  readonly isActivated: boolean;
  readonly password?: string;
}

export interface ICreateUser {
  readonly accessToken: string;
  user: IUser;
}

export interface ITokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}
