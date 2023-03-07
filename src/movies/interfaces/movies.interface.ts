import { User } from 'src/users/schemas/users.schema';

export interface IMovies {
  readonly country: string;
  readonly director: string;
  readonly duration: number;
  readonly year: string;
  readonly description: string;
  readonly image: string;
  readonly trailerLink: string;
  readonly nameRU: string;
  readonly nameEN: string;
  readonly thumbnail: string;
  readonly movieId: number;
  readonly owner: User;
  readonly _id: string;
}

export interface IReqUserType {
  _id: string;
  email: string;
}

export interface RequestWithIdUser extends Request {
  user: IReqUserType;
  id: object;
}
