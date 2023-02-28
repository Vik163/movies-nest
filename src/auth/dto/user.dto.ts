export class UserDto {
  readonly name: string;
  readonly email: string;
  readonly isActivated: boolean;
  readonly _id: string;
  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this._id = model._id;
  }
}
