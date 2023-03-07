import { Types } from 'mongoose';
import { Request, Response } from 'express';

export interface IUser {
  readonly name: string;
  readonly email: string;
  readonly _id: Types.ObjectId;
  readonly isActivated: boolean;
  readonly password?: string;
}

export interface INewUser {
  readonly accessToken: string;
  user: IUser;
}

export interface ITokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: IUser;
}

export interface ResponseWithUser extends Response {
  user: IUser;
}
