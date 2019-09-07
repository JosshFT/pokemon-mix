import Pokemon from "Models/pokemon.model";

export const FETCH_POKEMON_REQUEST = 'FETCH_POKEMON_REQUEST';
export const FETCH_POKEMON_SUCESS = 'FETCH_POKEMON_SUCESS';
export const FETCH_POKEMON_FAILURE = 'FETCH_POKEMON_FAILURE';


/*
 * action creators
 */
function fetchPokemonRequest() {
  return { type: FETCH_POKEMON_REQUEST, payload: {loading: true} }
}

function fetchPokemonSuccess(pokemon: Pokemon) {
  return { type: FETCH_POKEMON_REQUEST, payload: pokemon }
}

function fetchPokemonFailure(error) {
  return { type: FETCH_POKEMON_REQUEST, payload: { error, loading: false } }
}


export function fetchPokemon(id: number) {
  return async dispatch => {
    dispatch(fetchPokemonRequest());
    return await this.http.get(`/pokemon/${id}`)
      .then((response) => response.json())
      .then((response) => {
        dispatch(fetchPokemonSuccess(response));
      })
      .catch((err) => {
        dispatch(fetchPokemonFailure(err));
      });
  }
}
