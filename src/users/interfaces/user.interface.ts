export interface UserItem {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
}

export interface UserCurrent {
  readonly password: any;
  readonly name: string;
  readonly email: string;
  readonly _id?: string;
}
