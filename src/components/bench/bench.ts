import { inject } from 'aurelia-dependency-injection';
import Pokemon from 'models/pokemon.model';
import ApplicationStore from 'store/app.store';
import PokemonService from 'services/pokemon.service';

import './bench.scss';
import { Subscription } from 'rxjs';


@inject(PokemonService)
export class Bench {
  bench: Pokemon[];
  subscription: Subscription;

  constructor(private pokemonService: PokemonService) {
    this.subscription = this.pokemonService.bench.subscribe((value) => {
      this.bench = value;
    });
  }

  combineEquals() {

  }
}
