import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Store } from 'redux';
import { Subject, BehaviorSubject } from 'rxjs';

import Pokemon from '../models/pokemon.model';
import PokemonTree from 'models/pokemon.tree';
import PokemonActions from '../actions/pokemon.actions';
import ApplicationStore from '../store/app.store';

@inject(ApplicationStore, PokemonActions)
export default class PokemonService {
  baseUrl: string;
  http: HttpClient;
  pokemons: Map<number, BehaviorSubject<PokemonTree>>;
  store: Store;
  subscription;
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

    this.pokemons = new Map<number, BehaviorSubject<PokemonTree>>();
    this.subscription = this.toObservable(this.store);
    this.subscription.subscribe(this.updatePokemonTree);
  }

  updatePokemonTree = (state) => {
    if (state.pokemon) {
      let tree = this.pokemonTreeFactory(state.pokemon);
      if(!this.pokemons.has(tree.value.id)) {
        this.pokemons.set(tree.value.id, new BehaviorSubject<PokemonTree>(tree));
      } else {
        this.pokemons.get(tree.value.id).next(tree);
      }
    }
  }

  async getPokemon(id: number) {
    // Dispatch some actions
    this.actions.fetchPokemon(id, this.http, true);
  }

  async getPokemonEvolutions(key: number, tree: PokemonTree) {
    this.pokemons.get(key).next(await this.actions.getPokemonEvolutions(tree, this.http));
    // return 
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }

  pokemonTreeFactory(pokemon: Pokemon) {
    return new PokemonTree(pokemon);
  }

  toObservable(store) {
    return {
      subscribe(onNext) {
        let dispose = store.subscribe(() => onNext(store.getState()));
        onNext(store.getState());
        return { dispose };
      }
    }
  }
}
