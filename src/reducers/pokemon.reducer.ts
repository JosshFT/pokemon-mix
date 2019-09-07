import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCESS, FETCH_POKEMON_FAILURE } from './../actions/pokemon.actions';


const initialState = {
  pokemon: {},
  loading: false
}

export function pokemonReducer(state = initialState, action) {
  console.log("TCL: pokemonReducer -> action", action);
  switch (action.type) {
    case FETCH_POKEMON_REQUEST:
      return state;
    case FETCH_POKEMON_SUCESS:
      return {...state,
      pokemon: action.payload};
    case FETCH_POKEMON_FAILURE:
      return state;
    default:
      return state;
  }
}
