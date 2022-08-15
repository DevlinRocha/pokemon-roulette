import { defineStore } from "pinia";
import { PokemonClass } from "../utilities/classes";
import { getRandomId } from "../utilities/functions";
import {
  DifficultyOptions,
  GenerationData,
  PokemonData,
} from "../utilities/interfaces";

export const useGameStore = defineStore("game", {
  state: () => ({
    minPokedex: 1,
    maxPokedex: 898,
    currentPokemon: {} as PokemonData,
    nextPokemon: {} as PokemonData,
    generations: [
      {
        id: 1,
        name: "Gen I",
        range: [1, 151],
      },
      {
        id: 2,
        name: "Gen II",
        range: [152, 251],
      },
      {
        id: 3,
        name: "Gen III",
        range: [252, 386],
      },
      {
        id: 4,
        name: "Gen IV",
        range: [387, 493],
      },
      {
        id: 5,
        name: "Gen V",
        range: [494, 649],
      },
      {
        id: 6,
        name: "Gen VI",
        range: [650, 721],
      },
      {
        id: 7,
        name: "Gen VII",
        range: [722, 809],
      },
      {
        id: 8,
        name: "Gen VIII",
        range: [810, 905],
      },
    ] as GenerationData[],
    selectedGenerationIds: [] as number[],
    inputVal: "",
    isGuessCorrect: false,
    hasGivenUp: false,
    difficulty: DifficultyOptions.NORMAL,
  }),

  actions: {
    selectAllGenerations() {
      this.selectedGenerationIds = this.generations.map(
        (generation) => generation.id
      );
    },

    async getPokemon(id: number) {
      if (id > this.maxPokedex)
        throw new Error(
          `Pokémon not found. There are ${this.maxPokedex} known Pokémon.`
        );

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    },

    async getPokemonName(id: number) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      const species = await response.json();
      // English: 7
      return species.names[7].name;
    },

    async loadPokemon(): Promise<void> {
      let validPokemonId = false;
      let pokemonId: number;

      do {
        // Can change minPokedex and maxPokedex for further optimization
        pokemonId = getRandomId(this.minPokedex, this.maxPokedex);

        validPokemonId = this.acceptedPokemonIdRanges.some(
          (range: [number, number]) =>
            pokemonId > range[0] && pokemonId < range[1]
        );

        if (this.acceptedPokemonIdRanges.length === 0) {
          validPokemonId = true;
        }
      } while (!validPokemonId);

      const pokemonData = await this.getPokemon(pokemonId);

      this.nextPokemon = new PokemonClass(
        pokemonId,
        await this.getPokemonName(pokemonId),
        pokemonData.sprites.front_default
      );
    },

    async setPokemon() {
      this.currentPokemon = this.nextPokemon;
    },
  },

  getters: {
    acceptedPokemonIdRanges: ({ selectedGenerationIds, generations }) => {
      return selectedGenerationIds.map((id) => {
        const selectedGeneration =
          generations.find((generation) => generation.id === id) ||
          generations[0];
        return selectedGeneration.range;
      });
    },
  },
});
