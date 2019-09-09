import { BehaviorSubject } from 'rxjs';
import PokemonTree from '../../models/pokemon.tree';
import { bindable, bindingMode } from "aurelia-framework";
import Pokemon from 'models/pokemon.model';
import './tree.scss'

export class Tree {
  @bindable tree: BehaviorSubject<PokemonTree>;
  pokemons: Pokemon[];
  circleContainer: string;
  getItemStyle;

  constructor() {
    this.pokemons = [];
  }

  bind(bindingContext: Object, overrideContext: Object) {
    this.tree.subscribe((value) => {
      this.pokemons = [];
      while (value) {
        this.pokemons.push(value.value);
        value = value.next;
      }
      this.getItemStyle = this.getStyle(this.pokemons.length-1, '20em', '6em');
    })
  }

  getStyle(itemCount, circleSize, itemSize) {
    console.log("TCL: Tree -> getStyle -> itemCount", itemCount);
    let angle = 360 / itemCount;
    let globalStyle = `
      display: inline-block;
      position: relative;
      width: ${circleSize};
      height: ${circleSize};
      padding: 0;
      border-radius: 50%;
      list-style: none;
      margin: 20px;
      border: solid 5px tomato;
    `;

    this.circleContainer = globalStyle;
    return (index) => {
      let rot = index*angle;
      let its = `display: inline-block;
        max-width: 100%;
        border-radius: 50%;
        border: solid 5px tomato;
        transition: .15s;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${itemSize};
        height: ${itemSize};
        margin: -${parseInt(itemSize) / 2}em;
        opacity: 1;
        transform: rotate(${(rot) * 1}deg) translate(${parseInt(circleSize) / 2}em) rotate(${(rot) * -1}deg); scale(1);`
      return its;
    };
  }

  unbind() {
    this.tree.unsubscribe();
  }
}
