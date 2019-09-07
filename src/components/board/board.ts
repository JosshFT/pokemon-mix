import { Store } from 'redux';
import { inject, View, LogManager } from 'aurelia-framework';
import Pokemon from '../../models/pokemon.model';
import PokemonService from '../../services/pokemon.service';
import PokemonTree from 'models/pokemon.tree';
import './board.scss'
import ApplicationStore from '../../store/app.store';

@inject(PokemonService, ApplicationStore)
export class Board {
  pokemons: PokemonTree[];
  subscription;

  constructor(private pokemonService: PokemonService, private store: ApplicationStore) {
    this.pokemons = [];
    this.subscription = this.toObservable(this.store.store);

    this.subscription.subscribe((state) => {
      if (state.pokemon) {
        let tree = this.pokemonService.pokemonTreeFactory(state.pokemon);
        this.pokemons.push(tree);
      }
    })
  }

  async setPokemons() {
    this.pokemonService.getPokemon(1);
    // this.pokemonService.getPokemon(4);
    // this.pokemonService.getPokemon(7);
  }

  async getTree(pokemon: Pokemon, index: any) {
    let tree: PokemonTree = await this.pokemonService.getPokemonEvolutions(pokemon);
    this.pokemons[index].next = tree;
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

  unbind() {
    this.subscription();
  }
}
