export interface UserItem {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
  readonly _id?: string;
}

export interface ReqUserType {
  _id: string;
  email: string;
}

export interface IdUserRequest extends Request {
  user: ReqUserType;
  id: object;
}
