import Bench from 'models/bench.model';
import ApplicationStore from '../store/app.store';
import Pokemon from "../models/pokemon.model";
import { inject } from "aurelia-framework";
import { HttpClient } from 'aurelia-fetch-client';
import { Dispatch } from 'redux';
import PokemonTree from '../models/pokemon.tree';

export const FETCH_POKEMON_REQUEST = 'FETCH_POKEMON_REQUEST';
export const FETCH_POKEMON_SUCESS = 'FETCH_POKEMON_SUCESS';
export const FETCH_POKEMON_FAILURE = 'FETCH_POKEMON_FAILURE';

export const ADD_POKEMON_BENCH_REQUEST = 'ADD_POKEMON_BENCH_REQUEST';
export const ADD_POKEMON_BENCH_SUCCESS = 'ADD_POKEMON_BENCH_SUCCESS';
export const ADD_POKEMON_BENCH_FAILURE = 'ADD_POKEMON_BENCH_FAILURE';

export const CREATE_POKEMONTREE_SUCCESS = 'CREATE_POKEMONTREE_SUCCESS';
export const CREATE_POKEMONTREE_FAILURE = 'CREATE_POKEMONTREE_FAILURE';

@inject(ApplicationStore)
export default class PokemonActions {
  dispatch: Dispatch;
  baseUrl: string;
  http: HttpClient;

  constructor(store: ApplicationStore) {
    this.dispatch = store.store.dispatch;
    this.baseUrl = `https://pokeapi.co/api/v2`;
    this.http = new HttpClient().configure(config => {
      config
        .withBaseUrl(this.baseUrl)
        .withDefaults({
          headers: {
            'Accept': `application/json`,
            'Access-Control-Allow-Origin': `*`
          }
        })
    });
  }

  fetchPokemonRequest() {
    return { type: FETCH_POKEMON_REQUEST, payload: { loading: true } }
  }

  fetchPokemonSuccess(pokemon: Pokemon) {
    return { type: FETCH_POKEMON_SUCESS, payload: pokemon, loading: false }
  }

  fetchPokemonFailure(error) {
    return { type: FETCH_POKEMON_FAILURE, payload: { error, loading: false } }
  }

  addPokemonBenchRequest() {
    return { type: ADD_POKEMON_BENCH_REQUEST, payload: { loading: true } }
  }
  
  addPokemonBenchSucess(bench: Bench) {
    return { type: ADD_POKEMON_BENCH_SUCCESS, payload: { bench, loading: false } }
  }

  addPokemonBenchFailure(error) {
    return { type: ADD_POKEMON_BENCH_FAILURE, payload: { loading: false, error } }
  }

  addPokemonBench(pokemon: Pokemon, bench: Bench) {
    console.log("TCL: PokemonActions -> addPokemonBench -> bench", bench);
    this.dispatch(this.addPokemonBenchRequest());

    let newCount = 1;
    if(bench.count.has(pokemon.id)) {
      newCount = bench.count.get(pokemon.id).count + 1;
    }
    bench.count.set(pokemon.id, { count: newCount});
    bench.array.push(pokemon);
    this.dispatch(this.addPokemonBenchSucess(bench));
  }

  pokemonFactory(response: any, color?: string) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default, color);
  }

  async fetchPokemon(id: number, basePokemon: boolean = false, color? :string) {
    basePokemon && this.dispatch(this.fetchPokemonRequest());
    return await this.http.get(`/pokemon/${id}`)
      .then((response) => response.json())
      .then((response) => {
        let pokemon = this.pokemonFactory(response, color);
        basePokemon && this.dispatch(this.fetchPokemonSuccess(pokemon));
        return pokemon;
      })
      .catch((err) => {
        basePokemon && this.dispatch(this.fetchPokemonFailure(err));
      });
  }

  async getPokemonEvolutions(tree: PokemonTree) {
    // let tree = new PokemonTree(pokemon);
    let { pokemonUrl, color } = await this.http.get(`/pokemon-species/${tree.value.id}`)
    .then((response) => response.json())
    .then((response) => ({pokemonUrl: response.evolution_chain.url, color: response.color.name}))
    .catch((err) => console.log(err));

    let data = await this.http.fetch(pokemonUrl)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.log(err));

    let finalTree = tree;

    if (data.chain.evolves_to.length > 1) {
      let chain = data.chain.evolves_to[0];
      let i = 0;
      while (chain) {
        let pokemonId = chain.species.url.split("/");
        let pokemon: Pokemon = await this.fetchPokemon(pokemonId[pokemonId.length - 2], false, color);
        let tmp = tree;
        tree.next = new PokemonTree(pokemon);
        tree = tree.next;
        tree.prev = tmp;
        i++;
        chain = data.chain.evolves_to[i];
      }
    } else {
      let chain = data.chain.evolves_to[0];
      while (chain) {
        let pokemonId = chain.species.url.split("/");
        let pokemon: Pokemon = await this.fetchPokemon(pokemonId[pokemonId.length - 2], false, color);
        let tmp = tree;
        // if (pokemon.id < tree.value.id) {
        //   tree.prev = new PokemonTree(pokemon);
        //   tree = tree.prev;
        //   tree.next = tmp;
        // } else {
          tree.next = new PokemonTree(pokemon);
          tree = tree.next;
          tree.prev = tmp;
        // }
        chain = chain.evolves_to[0];
      }
    }
    return finalTree;
  }

  // placePokemonIntree(pokemon: Pokemon, tree: PokemonTree, tmp: PokemonTree, finalTree: PokemonTree) {
  //   if (pokemon.id > finalTree.value.id) {
  //     tree.next = new PokemonTree(pokemon);
  //     tree = tree.next;
  //     tree.prev = tmp;
  //   } else {

  //   }
  //   if (pokemon.id < tree.value.id) {
  //     tree.prev = new PokemonTree(pokemon);
  //     tree = tree.prev;
  //     tree.next = tmp;
  //   } else {
  //     tree.next = new PokemonTree(pokemon);
  //     tree = tree.next;
  //     tree.prev = tmp;
  //   }
  // }
}
