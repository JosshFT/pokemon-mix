import { ApplicationState } from './../app.d';
import { store } from './../store/app.storee';
import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Store } from 'redux';
import { BehaviorSubject } from 'rxjs';

import Pokemon from '../models/pokemon.model';
import PokemonTree from '../models/pokemon.tree';
import * as PokemonActions from '../actions/pokemon.actions.copy';

export default class PokemonService {
  pokemons: Map<number, BehaviorSubject<PokemonTree>>;
  bench: BehaviorSubject<Pokemon[]>;
  store: Store;
  subscription;


  constructor() {
    this.store = store;
    this.pokemons = new Map<number, BehaviorSubject<PokemonTree>>();
    this.bench = new BehaviorSubject([]);
    this.subscription = this.toObservable(this.store);
    this.subscription.subscribe(this.updatePokemonTree);
  }

  updatePokemonTree = (state: ApplicationState) => {
    if (state.pokemonReducer.pokemon) {
      let tree = this.pokemonTreeFactory(state.pokemonReducer.pokemon);
      if(!this.pokemons.has(tree.value.id)) {
        this.pokemons.set(tree.value.id, new BehaviorSubject<PokemonTree>(tree));
      } else {
        this.pokemons.get(tree.value.id).next(tree);
      }
    }

    if (state.pokemonReducer.bench) {
      console.log("TCL: PokemonService -> updatePokemonTree -> state.pokemonReducer.bench", state.pokemonReducer.bench);
      this.bench.next(state.pokemonReducer.bench);
    }
  }

  async getPokemon(id: number) {
    console.log("TCL: PokemonService -> getPokemon -> id", id);
    // Dispatch some actions
    new PokemonActions.fetchPokemon(id, true).getPokemon();
  }

  async getPokemonEvolutions(key: number, tree: PokemonTree) {
    this.pokemons.get(key).next(await new PokemonActions.getPokemonEvolutions(tree).getEvolutions());
    return this.pokemons.get(key).value;
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }

  pokemonTreeFactory(pokemon: Pokemon) {
    return new PokemonTree(pokemon);
  }

  async addPokemonBench(tree: PokemonTree) {
    // let tmpTree = await this.getPokemonEvolutions(tree.value.id, tree);
    new PokemonActions.addPokemonBench(tree, this.bench.value).addPokemon();
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
