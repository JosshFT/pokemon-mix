import Pokemon from '../models/pokemon.model';
import { HttpClient } from 'aurelia-fetch-client';
import PokemonTree from 'models/pokemon.tree';
import PokemonActions from '../actions/pokemon.actions';
import ApplicationStore from '../store/app.store';
import { inject } from 'aurelia-framework';
import { Store } from 'redux';

@inject(ApplicationStore, PokemonActions)
export default class PokemonService {
  baseUrl: string;
  http: HttpClient;
  unsubscribe;
  store: Store;
  actions: PokemonActions;
  
  constructor(store: ApplicationStore, pokemonActions: PokemonActions) {
    this.actions = pokemonActions;
    this.store = store.store;
    this.baseUrl = `https://pokeapi.co/api/v2`;
    this.http = new HttpClient().configure(config => {
      config
        .withBaseUrl(this.baseUrl)
        .withDefaults({
          headers: {
            'Accept': `application/json`,
            'Access-Control-Allow-Origin': `*`
          }
        })
    });
  }

  async getPokemon(id: number){
    // Dispatch some actions
    this.actions.fetchPokemon(id, this.http, true);
  }

  async getPokemonEvolutions(tree: PokemonTree) {
    return this.actions.getPokemonEvolutions(tree, this.http);
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }
  pokemonTreeFactory(pokemon: Pokemon) {
    return new PokemonTree(pokemon);
  }
}
