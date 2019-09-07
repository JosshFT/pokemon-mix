import { createStore } from 'redux'
import { pokemonReducer } from '../reducers/pokemon.reducer'
const store = createStore(pokemonReducer);

export default store;
