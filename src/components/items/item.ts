import { bindable } from 'aurelia-framework';
import Pokemon from 'models/pokemon.model';
import './item.scss';

export class Item {
  @bindable pokemon: Pokemon;
  styleString: string;

  bind(bindingContext: Object, overrideContext: Object) {
    this.styleString = `background-color: ${this.pokemon.color}`;
  }
}
