import Pokemon from '../models/pokemon.model';
import { HttpClient } from 'aurelia-fetch-client';
import PokemonTree from 'models/pokemon.tree';
import store from 'store/app.store';
import { fetchPokemon } from 'actions/pokemon.actions';

export default class PokemonService {
  baseUrl: string;
  http: HttpClient;
  unsubscribe;
  constructor() {
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
    // Log the initial state
    console.log(store.getState());
    // Every time the state changes, log it
    // Note that subscribe() returns a function for unregistering the listener
    this.unsubscribe = store.subscribe(() => console.log(store.getState()));
  }

  async getPokemon(id: number){
    // Dispatch some actions
    store.dispatch(fetchPokemon(id));
  }

  async getPokemonEvolutions(pokemon: Pokemon) {
    let tree = new PokemonTree(pokemon);
    let pokemonUrl = await this.http.get(`/pokemon-species/${pokemon.id}`)
      .then((response) => response.json())
      .then((response) => response.evolution_chain.url)
      .catch((err) => console.log(err));

    let data = await this.http.fetch(pokemonUrl)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.log(err));
      
    let chain = data.chain.evolves_to[0];
    let finalTree = tree;
    while (chain) {
      let pokemonId = chain.species.url.split("/");
      let pokemon: Pokemon = this.pokemonFactory(await this.getPokemon(pokemonId[pokemonId.length - 2]))
      let tmp = tree;
      tree.next = new PokemonTree(pokemon);
      tree = tree.next;
      tree.prev = tmp;
      chain = chain.evolves_to[0];
    }

    return finalTree;
  }

  pokemonFactory(response: any) {
    return new Pokemon(response.id, response.name, response.types[0].type.name, response.sprites.front_default);
  }
  pokemonTreeFactory(pokemon: Pokemon) {
    return new PokemonTree(pokemon);
  }
}
