export interface UserType {
  readonly name: string;
  readonly email: string;
  readonly _id: string;
  readonly isActivated: boolean;
}

export interface CreateUserType {
  tokens: { readonly accessToken: string; readonly refreshToken: string };
  user: UserType;
}
