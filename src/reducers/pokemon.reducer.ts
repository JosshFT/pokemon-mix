import Pokemon from 'models/pokemon.model';
import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCESS, FETCH_POKEMON_FAILURE, ADD_POKEMON_BENCH_REQUEST, ADD_POKEMON_BENCH_FAILURE, ADD_POKEMON_BENCH_SUCCESS } from './../actions/pokemon.actions.copy';
import { Action } from '../app.d';

export interface PokemonState {
  pokemon?: Pokemon;
  bench?: Pokemon[];
  loading?: boolean;
  error?: any;
}

export const initialState: PokemonState = {
  pokemon: null,
  bench: [],
  loading: false,
  error: null
}

export function pokemonReducer(state = initialState, action: Action<PokemonState>): PokemonState {
  switch (action.type) {
    case FETCH_POKEMON_REQUEST:
      return {
        ...state,
        loading: action.payload.loading
      };
    case FETCH_POKEMON_SUCESS:
      return {
        ...state,
        pokemon: action.payload.pokemon
      };
    case FETCH_POKEMON_FAILURE:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error
      };
    case ADD_POKEMON_BENCH_REQUEST:
      return {
        ...state,
        loading: action.payload.loading
      };
    case ADD_POKEMON_BENCH_FAILURE:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error
      };
    case ADD_POKEMON_BENCH_SUCCESS:
      let bench = action.payload.bench;
      console.log("TCL: bench", bench);
      return {
        ...state,
        bench
      };
    default:
      return state;
  }
}
