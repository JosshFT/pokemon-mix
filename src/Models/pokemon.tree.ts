import Pokemon from './pokemon.model';
export default class PokemonTree {
  prev?: PokemonTree;
  next?: PokemonTree;
  value: Pokemon;
  children: number;

  constructor(value: Pokemon, next?: PokemonTree) {
    this.value = value;
    this.next = next;
  }

  public length () {
    this.children = 0;
    let hasNext = this.next;
    while (hasNext) {
      this.children++;
      hasNext = hasNext.next;
    }
    return this.children;
  }

}
