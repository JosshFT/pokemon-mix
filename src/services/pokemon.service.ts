import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Store } from 'redux';
import { BehaviorSubject } from 'rxjs';

import Pokemon from '../models/pokemon.model';
import PokemonTree from 'models/pokemon.tree';
import PokemonActions from '../actions/pokemon.actions';
import ApplicationStore from '../store/app.store';
import Bench from 'models/bench.model';

@inject(ApplicationStore, PokemonActions)
export default class PokemonService {
  baseUrl: string;
  http: HttpClient;
  pokemons: Map<number, BehaviorSubject<PokemonTree>>;
  bench: BehaviorSubject<Pokemon[]>;
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
    this.bench = new BehaviorSubject([]);
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

    if (state.bench) {
      this.bench.next(state.bench);
    }
  }

  async getPokemon(id: number) {
    // Dispatch some actions
    this.actions.fetchPokemon(id, true);
  }

  async getPokemonEvolutions(key: number, tree: PokemonTree) {
    this.pokemons.get(key).next(await this.actions.getPokemonEvolutions(tree));
    return this.pokemons.get(key).value;
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }

  pokemonTreeFactory(pokemon: Pokemon) {
    return new PokemonTree(pokemon);
  }

  async addPokemonBench(tree: PokemonTree) {
    let tmpTree = await this.getPokemonEvolutions(tree.value.id, tree);
    this.actions.addPokemonBench(tmpTree, this.bench.value);
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
