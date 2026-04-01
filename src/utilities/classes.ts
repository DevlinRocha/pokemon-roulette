export class PokemonClass {
  id: number;
  name: string;
  img: string;
  types: string[];
  height: number;
  weight: number;

  constructor(
    id: number,
    name: string,
    img: string,
    types: string[],
    height: number,
    weight: number,
  ) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.types = types;
    this.height = height;
    this.weight = weight;
  }
}
