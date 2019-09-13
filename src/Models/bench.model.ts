import Pokemon from "./pokemon.model";

export default class Bench {
  count: Map<number, number>;
  array: Pokemon[];

  constructor(count: Map<number, number>, array: Pokemon[]) {
    this.count = count;
    this.array = array;
  }
}
