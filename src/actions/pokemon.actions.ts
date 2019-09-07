import ApplicationStore from '../store/app.store';
import Pokemon from "../models/pokemon.model";
import { inject } from "aurelia-framework";
import { Dispatch } from 'redux';

export const FETCH_POKEMON_REQUEST = 'FETCH_POKEMON_REQUEST';
export const FETCH_POKEMON_SUCESS = 'FETCH_POKEMON_SUCESS';
export const FETCH_POKEMON_FAILURE = 'FETCH_POKEMON_FAILURE';

@inject(ApplicationStore)
export default class PokemonActions {
  dispatch: Dispatch;

  constructor(store: ApplicationStore) {
    this.dispatch = store.store.dispatch;
  }

  fetchPokemonRequest() {
    return { type: FETCH_POKEMON_REQUEST, payload: { loading: true } }
  }

  fetchPokemonSuccess(pokemon: Pokemon) {
    return { type: FETCH_POKEMON_SUCESS, payload: pokemon }
  }

  fetchPokemonFailure(error) {
    return { type: FETCH_POKEMON_FAILURE, payload: { error, loading: false } }
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }

  fetchPokemon(id: number, http) {
    return async () => {
      this.dispatch(this.fetchPokemonRequest());
      return await http.get(`/pokemon/${id}`)
        .then((response) => response.json())
        .then((response) => {
          let pokemon = this.pokemonFactory(response);
          this.dispatch(this.fetchPokemonSuccess(pokemon));
          return pokemon;
        })
        .catch((err) => {
          this.dispatch(this.fetchPokemonFailure(err));
        });
    }
  }
}
