import { createStore, Store, combineReducers } from 'redux'
import { pokemonReducer } from '../reducers/pokemon.reducer'
import { PokemonState } from './../reducers/pokemon.reducer';
import * as pokemonStore from '../reducers/pokemon.reducer'
import { ApplicationState } from '../app.d'

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION__: any }
}

const initialState: ApplicationState = {
  pokemonReducer: pokemonStore.initialState
}

export const store: Store = createStore(combineReducers<ApplicationState>({ pokemonReducer }), initialState, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined);
