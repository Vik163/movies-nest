export interface IUserItem {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
  readonly _id?: string;
}

export interface IReqUserType {
  _id: string;
  email: string;
}

export interface IIdUserRequest extends Request {
  user: IReqUserType;
  id: object;
}
