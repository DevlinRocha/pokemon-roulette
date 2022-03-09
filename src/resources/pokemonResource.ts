import Resource from "rest-resource";
import { PokemonClient } from "./client";

export interface PokemonData extends Record<string, any> {
  name?: string;
  img?: string;
}

export class PokemonResource extends Resource {
  static attributes: PokemonData;

  static client = new PokemonClient("https://pokeapi.co/api/v2");

  static endpoint = "/pokemon";
}
