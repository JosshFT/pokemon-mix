import { bindable, View, bindingMode } from 'aurelia-framework';
import PokemonTree from 'models/pokemon.tree';
import './item.scss';

export class Item {
  @bindable({ defaultBindingMode: bindingMode.toView }) tree: PokemonTree;

  constructor() {
    console.log("TESTING")
  }

  bind(bindingContext: Object, overrideContext: Object) {
    console.log("TCL: Item -> bind -> overrideContext", overrideContext);
    console.log("TCL: Item -> bind -> bindingContext", bindingContext);
    this.tree;
    console.log("TCL: Item -> created -> this.tree;", this.tree);
  }
}
