import Pokemon from './pokemon.model';
export default class PokemonTree {
  prev?: PokemonTree;
  next?: PokemonTree;
  value: Pokemon;

  constructor(value: Pokemon, next?: PokemonTree) {
    this.value = value;
    this.next = next;
  }

}
