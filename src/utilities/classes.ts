export class PokemonClass {
  id: number;
  name: string;
  img: string;
  types: string[];
  height: number;
  weight: number;
  generation: string;

  constructor(
    id: number,
    name: string,
    img: string,
    types: string[],
    height: number,
    weight: number,
    generation: string,
  ) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.types = types;
    this.height = height;
    this.weight = weight;
    this.generation = generation;
  }
}
