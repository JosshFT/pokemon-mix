import { createStore, Store } from 'redux'
import { pokemonReducer } from '../reducers/pokemon.reducer'

declare global {
  interface Window {__REDUX_DEVTOOLS_EXTENSION__: any }
}

// just a simple wrapper around the redux store
export default class ApplicationStore {
  store: Store;

  constructor() {
    this.store = this._configureStore();
  }

  _configureStore() {
    return createStore(pokemonReducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined);
  }
}
