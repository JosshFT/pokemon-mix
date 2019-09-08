import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCESS, FETCH_POKEMON_FAILURE, CREATE_POKEMONTREE_FAILURE, CREATE_POKEMONTREE_SUCCESS } from './../actions/pokemon.actions';


const initialState = {
  pokemon: {},
  pokemons: [],
  loading: false
}

export function pokemonReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_POKEMON_REQUEST:
      return state;
    case FETCH_POKEMON_SUCESS:
      return {...state,
      pokemon: action.payload};
    case FETCH_POKEMON_FAILURE:
      return state;
    case CREATE_POKEMONTREE_SUCCESS:
      return {
        ...state,
        pokemons: action.payload
      };
    case CREATE_POKEMONTREE_FAILURE:
      return state;
    default:
      return state;
  }
}
