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
    });

    this.setPokemons();
  }

  async setPokemons() {
    this.pokemonService.getPokemon(1);
    this.pokemonService.getPokemon(4);
    this.pokemonService.getPokemon(7);
    this.pokemonService.getPokemon(133);
  }

  async getTree(tree: PokemonTree, index: any) {
    console.log("TCL: Board -> getTree -> tree", tree);
    this.pokemonService.getPokemonEvolutions(tree);
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
