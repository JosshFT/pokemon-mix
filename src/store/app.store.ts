import { createStore, Store, combineReducers } from 'redux'
import { pokemonReducer } from '../reducers/pokemon.reducer'
import { PokemonState } from './../reducers/pokemon.reducer';

declare global {
  interface Window {__REDUX_DEVTOOLS_EXTENSION__: any }
}

export default class ApplicationStore {
  store: Store;
  initialState;

  constructor() {
    this.initialState = {
      pokemon: {},
      pokemons: [],
      loading: false
    }
    this.store = this._configureStore();
  }

  _configureStore() {
    return createStore(combineReducers(pokemonReducer), {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined);
  }
}
