import { BehaviorSubject } from 'rxjs';
import PokemonTree from '../../models/pokemon.tree';
import { bindable, bindingMode } from "aurelia-framework";
import Pokemon from 'models/pokemon.model';
import './tree.scss'

export class Tree {
  @bindable tree: BehaviorSubject<PokemonTree>;
  pokemons: Pokemon[];
  items: number;

  constructor() {
    this.pokemons = [];
    this.items = 1;
  }

  bind(bindingContext: Object, overrideContext: Object) {
    this.tree.subscribe((value) => {
      this.pokemons = [];
      while (value) {
        this.pokemons.push(value.value);
        value = value.next;
      }
      this.items = this.pokemons.length - 1;
    })
  }

  unbind() {
    this.tree.unsubscribe();
  }
}
