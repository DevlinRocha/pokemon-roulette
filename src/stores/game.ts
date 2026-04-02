import { defineStore } from "pinia";
import { PokemonClass } from "../utilities/classes";
import { formatPokemonName, getRandomId } from "../utilities/functions";
import {
  DifficultyOptions,
  GenerationData,
  PokemonData,
  PokemonNameData,
} from "../utilities/interfaces";

function getAcceptedPokemonIdRanges(
  selectedGenerationIds: number[],
  generations: GenerationData[]
) {
  return selectedGenerationIds.map((id) => {
    const selectedGeneration =
      generations.find((generation) => generation.id === id) || generations[0];

    return selectedGeneration.range;
  });
}

function isPokemonIdAccepted(
  id: number,
  acceptedPokemonIdRanges: [number, number][]
) {
  if (acceptedPokemonIdRanges.length === 0) return true;

  return acceptedPokemonIdRanges.some(
    (range) => id >= range[0] && id <= range[1]
  );
}

export const useGameStore = defineStore("game", {
  state: () => ({
    minPokedex: 1,
    maxPokedex: 1025,
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
      {
        id: 9,
        name: "Gen IX",
        range: [906, 1025],
      },
    ] as GenerationData[],
    selectedGenerationIds: [] as number[],
    pokemonNames: [] as PokemonNameData[],
    isLoadingPokemonNames: false,
    inputVal: "",
    isGuessCorrect: false,
    hasGivenUp: false,
    difficulty: DifficultyOptions.NORMAL,
    nextPokemonRequestId: 0,
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

    async loadPokemonNames() {
      if (this.pokemonNames.length || this.isLoadingPokemonNames) return;

      this.isLoadingPokemonNames = true;

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species?limit=${this.maxPokedex}`
        );
        const species = await response.json();

        this.pokemonNames = species.results
          .map(({ name, url }: { name: string; url: string }) => ({
            id: Number(url.split("/").filter(Boolean).pop()),
            name: formatPokemonName(name),
          }))
          .filter(({ id }: PokemonNameData) => id <= this.maxPokedex)
          .sort((a: PokemonNameData, b: PokemonNameData) => a.id - b.id);
      } finally {
        this.isLoadingPokemonNames = false;
      }
    },

    async loadPokemon() {
      const requestId = ++this.nextPokemonRequestId;
      const acceptedPokemonIdRanges = getAcceptedPokemonIdRanges(
        this.selectedGenerationIds,
        this.generations
      );
      let pokemonId: number;

      do {
        // Can change minPokedex and maxPokedex for further optimization
        pokemonId = getRandomId(this.minPokedex, this.maxPokedex, [
          this.currentPokemon.id,
        ]);
      } while (!isPokemonIdAccepted(pokemonId, acceptedPokemonIdRanges));

      const pokemonData = await this.getPokemon(pokemonId);
      const pokemonName = await this.getPokemonName(pokemonId);

      if (requestId !== this.nextPokemonRequestId) return;

      if (!isPokemonIdAccepted(pokemonId, this.acceptedPokemonIdRanges)) {
        await this.loadPokemon();
        return;
      }

      this.nextPokemon = new PokemonClass(
        pokemonId,
        pokemonName,
        pokemonData.sprites.front_default,
        pokemonData.types
          .sort(
            (
              a: { slot: number; type: { name: string } },
              b: { slot: number; type: { name: string } }
            ) => a.slot - b.slot
          )
          .map(({ type }: { type: { name: string } }) =>
            formatPokemonName(type.name)
          ),
        pokemonData.height,
        pokemonData.weight,
      );
    },

    async setPokemon() {
      this.currentPokemon = this.nextPokemon;
    },

    giveUp() {
      this.inputVal = this.currentPokemon.name;
      this.isGuessCorrect = false;
      this.hasGivenUp = true;
      this.loadPokemon();
    },
  },

  getters: {
    acceptedPokemonIdRanges: ({ selectedGenerationIds, generations }) => {
      return getAcceptedPokemonIdRanges(selectedGenerationIds, generations);
    },

    autocompletePokemonNames: (state): PokemonNameData[] => {
      const acceptedPokemonIdRanges = getAcceptedPokemonIdRanges(
        state.selectedGenerationIds,
        state.generations
      );

      if (acceptedPokemonIdRanges.length === 0) return state.pokemonNames;

      return state.pokemonNames.filter(({ id }: PokemonNameData) =>
        isPokemonIdAccepted(id, acceptedPokemonIdRanges)
      );
    },
  },
});
