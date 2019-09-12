import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCESS, FETCH_POKEMON_FAILURE, ADD_POKEMON_BENCH_REQUEST, ADD_POKEMON_BENCH_FAILURE, ADD_POKEMON_BENCH_SUCCESS } from './../actions/pokemon.actions';

export function pokemonReducer(state, action) {
  switch (action.type) {
    case FETCH_POKEMON_REQUEST:
      return {
        ...state,
        loading: action.payload.loading
      };
    case FETCH_POKEMON_SUCESS:
      return {
        ...state,
        pokemon: action.payload
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
      let pokemons = state.pokemons ? [...state.pokemons] : [];
      pokemons.push(action.payload.pokemon)
      return {
        ...state,
        pokemons
      };
    default:
      return state;
  }
}
