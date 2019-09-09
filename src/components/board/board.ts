import { Store } from 'redux';
import { inject, View, LogManager } from 'aurelia-framework';
import Pokemon from '../../models/pokemon.model';
import PokemonService from '../../services/pokemon.service';
import PokemonTree from 'models/pokemon.tree';
import './board.scss'
import ApplicationStore from '../../store/app.store';
import { BehaviorSubject } from 'rxjs';

@inject(PokemonService, ApplicationStore)
export class Board {
  pokemons: Map<number, BehaviorSubject<PokemonTree>>;

  constructor(private pokemonService: PokemonService, private store: ApplicationStore) {
    this.pokemons = this.pokemonService.pokemons;
    this.setPokemons();
  }

  async setPokemons() {
    this.pokemonService.getPokemon(1);
    this.pokemonService.getPokemon(4);
    this.pokemonService.getPokemon(7);
    this.pokemonService.getPokemon(133);
  }

  async getTree(key: number, tree: PokemonTree) {
    this.pokemonService.getPokemonEvolutions(key, tree);
  }
}
