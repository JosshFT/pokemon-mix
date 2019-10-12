import { store } from '../store/app.storee';
import { PokemonState } from '../reducers/pokemon.reducer';
import Bench from '../models/bench.model';
import Pokemon from "../models/pokemon.model";
import { HttpClient } from 'aurelia-fetch-client';
import { Dispatch } from 'redux';
import PokemonTree from '../models/pokemon.tree';
import { Action } from '../app.d';

export const FETCH_POKEMON_REQUEST = 'FETCH_POKEMON_REQUEST';
export const FETCH_POKEMON_SUCESS = 'FETCH_POKEMON_SUCESS';
export const FETCH_POKEMON_FAILURE = 'FETCH_POKEMON_FAILURE';

export const ADD_POKEMON_BENCH_REQUEST = 'ADD_POKEMON_BENCH_REQUEST';
export const ADD_POKEMON_BENCH_SUCCESS = 'ADD_POKEMON_BENCH_SUCCESS';
export const ADD_POKEMON_BENCH_FAILURE = 'ADD_POKEMON_BENCH_FAILURE';

export const CREATE_POKEMONTREE_SUCCESS = 'CREATE_POKEMONTREE_SUCCESS';
export const CREATE_POKEMONTREE_FAILURE = 'CREATE_POKEMONTREE_FAILURE';

export const BASE_URL = `https://pokeapi.co/api/v2`;

const httpClient = new HttpClient().configure(config => {
  config
    .withBaseUrl(BASE_URL)
    .withDefaults({
      headers: {
        'Accept': `application/json`,
        'Access-Control-Allow-Origin': `*`
      }
    })
});

export class fetchPokemonRequest implements Action<PokemonState> {
  type = FETCH_POKEMON_REQUEST;
  payload: PokemonState = {
    loading: true
  };
}

export class fetchPokemonSuccess implements Action<PokemonState> {
  readonly type = FETCH_POKEMON_SUCESS;
  readonly payload: PokemonState = {
    loading: false,
    pokemon: null
  };

  constructor(pokemon: Pokemon) {
    this.payload.pokemon = pokemon;
  }
}

export class pokemonError implements Action<PokemonState>{
  readonly type = FETCH_POKEMON_FAILURE;
  readonly payload: PokemonState = {
    loading: false
  };

  constructor(error: any) {
    this.payload.error = error;
  }
}

export class addPokemonBenchRequest implements Action<PokemonState> {
  readonly type = ADD_POKEMON_BENCH_REQUEST;
  readonly payload: PokemonState = {
    loading: true
  };
}

export class addPokemonBenchSucess implements Action<PokemonState> {
  readonly type = ADD_POKEMON_BENCH_SUCCESS;
  readonly payload: PokemonState = {
    loading: false
  };

  constructor(bench: Pokemon[]) {
    this.payload.bench = bench;
  }
}

export class addPokemonBench {
  dispatch: Dispatch;

  constructor(private tree: PokemonTree, private bench: Pokemon[]) {
    console.log("TCL: PokemonActions -> addPokemonBench -> bench", bench);
    this.dispatch = store.dispatch;
    this.dispatch({...new addPokemonBenchRequest()});
  }

  addPokemon() {
    if (this.bench.filter((e) => e.id === this.tree.value.id).length === 2) {

    } else {
      this.bench.push(this.tree.value);
    }
    console.log("TCL: addPokemonBench -> addPokemon -> this.bench", this.bench);

    this.dispatch({...new addPokemonBenchSucess(this.bench)});
  }
}

export class fetchPokemon {
  http: HttpClient;
  dispatch: Dispatch<PokemonAction>;
  constructor(private id: number, private basePokemon: boolean = false, private color?: string) {
    this.http = httpClient;
    this.dispatch = store.dispatch;
  }

  pokemonFactory(response: any, color?: string) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default, color);
  }

  async getPokemon() {
    this.basePokemon && this.dispatch({ ...new fetchPokemonRequest()});
    await this.http.get(`/pokemon/${this.id}`)
      .then((response) => response.json())
      .then((response) => {
        let pokemon = this.pokemonFactory(response, this.color);
        this.basePokemon && this.dispatch({...new fetchPokemonSuccess(pokemon)});
        return pokemon;
      })
      .catch((err) => {
        this.basePokemon && this.dispatch({...new pokemonError(err)});
        return null;
      });
  }
}

export class getPokemonEvolutions {
  http: HttpClient;
  constructor(private tree: PokemonTree) {
    this.http = httpClient;
  }

  async getEvolutions() {
    let { pokemonUrl, color } = await this.http.get(`/pokemon-species/${this.tree.value.id}`)
      .then((response) => response.json())
      .then((response) => Promise.resolve({ pokemonUrl: response.evolution_chain.url, color: response.color.name }))
      .catch((err) => {
        console.log(err);
        return Promise.resolve({ pokemonUrl: null, color: null });
      });

    let data = await this.http.fetch(pokemonUrl)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.log(err));

    let finalTree = this.tree;

    if (data.chain.evolves_to.length > 1) {
      let chain = data.chain.evolves_to[0];
      let i = 0;
      while (chain) {
        let pokemonId = chain.species.url.split("/");
        let pokemon: Pokemon = await new fetchPokemon(pokemonId[pokemonId.length - 2], false, color).getPokemon();
        let tmp = this.tree;
        this.tree.next = new PokemonTree(pokemon);
        this.tree = this.tree.next;
        this.tree.prev = tmp;
        i++;
        chain = data.chain.evolves_to[i];
      }
    } else {
      let chain = data.chain.evolves_to[0];
      while (chain) {
        let pokemonId = chain.species.url.split("/");
        let pokemon: Pokemon = await new fetchPokemon(pokemonId[pokemonId.length - 2], false, color).getPokemon();
        let tmp = this.tree;
        this.tree.next = new PokemonTree(pokemon);
        this.tree = this.tree.next;
        this.tree.prev = tmp;
        chain = chain.evolves_to[0];
      }
    }
    return finalTree;
  }
}

export type PokemonAction = fetchPokemonRequest | fetchPokemonSuccess | pokemonError | addPokemonBenchRequest | addPokemonBenchSucess
