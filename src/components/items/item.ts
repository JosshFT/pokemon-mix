import { bindable, View, bindingMode } from 'aurelia-framework';
import PokemonTree from 'models/pokemon.tree';
import './item.scss';

export class Item {
  @bindable({ defaultBindingMode: bindingMode.toView }) tree: PokemonTree;
  styleString: string;

  constructor() {}

  bind(bindingContext: Object, overrideContext: Object) {
    this.styleString = `background-color: ${this.tree.value.color}`;
  }
}
