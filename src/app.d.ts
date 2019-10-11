import { PokemonState } from './reducers/pokemon.reducer';

export interface Action<T> {
  type: string;
  payload?: T;
}

export class Action<T> {
  type: string;
  payload?: T;
}

export interface ApplicationState {
  pokemonReducer: PokemonState
}
