export interface PokemonData {
  id: number;
  name: string;
  img: string;
  types: string[];
  height: number;
  weight: number;
}

export interface PokemonNameData {
  id: number;
  name: string;
}

export interface GenerationData {
  id: number;
  name: string;
  range: [number, number];
}

export enum DifficultyOptions {
  EASY = "easy",
  NORMAL = "normal",
}
