import { inject, View, LogManager } from 'aurelia-framework';
import Pokemon from '../../Models/pokemon.model';
import PokemonService from '../../services/pokemon.service';
import PokemonTree from 'Models/pokemon.tree';
import './board.scss'

@inject(PokemonService)
export class Board {
  pokemons: PokemonTree[];

  constructor(private pokemonService: PokemonService) {
    this.pokemons = [];
  }

  async setPokemons() {
    let data = await this.pokemonService.getPokemon(1);
    let pokemon = this.pokemonService.pokemonFactory(data);
    let tree = this.pokemonService.pokemonTreeFactory(pokemon);
    this.pokemons.push(tree);
  }

  async getTree(pokemon: Pokemon, index: any) {
    let tree: PokemonTree = await this.pokemonService.getPokemonEvolutions(pokemon);
    this.pokemons[index].next = tree;
    // this.pokemons.push(tree);
    console.log("TCL: Board -> getTree -> this.pokemons", this.pokemons);
  }
}
