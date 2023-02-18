import { User } from 'src/users/schemas/users.schema';

export interface MoviesType {
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

export interface MoviesInitialType {
  readonly country: string;
  readonly director: string;
  readonly duration: number;
  readonly year: string;
  readonly description: string;
  readonly image: object;
  readonly trailerLink: string;
  readonly nameRU: string;
  readonly nameEN: string;
  readonly id: string;
  readonly updated_at: string;
  readonly created_at: string;
}
