import { defineStore } from "pinia";
import { PokemonClass } from "../utilities/classes";
import { formatPokemonName, getRandomId } from "../utilities/functions";
import {
  DifficultyOptions,
  GenerationData,
  LocalizedPokemonName,
  PokemonData,
  PokemonNameData,
} from "../utilities/interfaces";

type PokemonApiResponse = {
  sprites: {
    front_default: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
};

type PokemonSpeciesResponse = {
  name: string;
  names: Array<{
    language: {
      name: string;
    };
    name: string;
  }>;
  generation: {
    name: string;
  };
};

type PokemonSpeciesListResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

const GENERATIONS: GenerationData[] = [
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
];

const LOCALIZED_NAME_LANGUAGES: Array<{
  apiName: string;
  language: string;
  flag: string;
}> = [
  { apiName: "ja-Hrkt", language: "Japanese", flag: "🇯🇵" },
  { apiName: "es", language: "Spanish", flag: "🇪🇸" },
  { apiName: "fr", language: "French", flag: "🇫🇷" },
  { apiName: "de", language: "German", flag: "🇩🇪" },
  { apiName: "ko", language: "Korean", flag: "🇰🇷" },
  { apiName: "zh-Hans", language: "Chinese", flag: "🇨🇳" },
];

const EMPTY_POKEMON = (): PokemonData => ({
  id: 0,
  name: "",
  img: "",
  types: [],
  height: 0,
  weight: 0,
  generation: "",
  localizedNames: [],
});

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${url}`);
  }

  return (await response.json()) as T;
}

function getAcceptedPokemonIdRanges(
  selectedGenerationIds: number[],
  generations: GenerationData[]
): [number, number][] {
  if (selectedGenerationIds.length === 0) return [];

  const selectedGenerationIdSet = new Set(selectedGenerationIds);

  return generations
    .filter(({ id }) => selectedGenerationIdSet.has(id))
    .map(({ range }) => range);
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

function getRandomAcceptedPokemonId(
  minPokedex: number,
  maxPokedex: number,
  acceptedPokemonIdRanges: [number, number][],
  currentPokemonId?: number
) {
  let pokemonId: number;

  do {
    pokemonId = getRandomId(minPokedex, maxPokedex, currentPokemonId ? [
      currentPokemonId,
    ] : undefined);
  } while (!isPokemonIdAccepted(pokemonId, acceptedPokemonIdRanges));

  return pokemonId;
}

function createPokemon(
  id: number,
  pokemonData: PokemonApiResponse,
  speciesData: PokemonSpeciesResponse
): PokemonData {
  const englishName = speciesData.names.find(
    ({ language }) => language.name === "en"
  );
  const generation = speciesData.generation.name
    .replace("generation-", "Gen ")
    .toUpperCase();
  const localizedNames: LocalizedPokemonName[] = LOCALIZED_NAME_LANGUAGES
    .map(({ apiName, language, flag }) => {
      const localizedName = speciesData.names.find(
        ({ language: entryLanguage }) => entryLanguage.name === apiName
      );

      if (!localizedName?.name) return null;

      return {
        language,
        flag,
        name: localizedName.name,
      };
    })
    .filter((entry): entry is LocalizedPokemonName => entry !== null);

  return new PokemonClass(
    id,
    englishName?.name || formatPokemonName(speciesData.name),
    pokemonData.sprites.front_default,
    [...pokemonData.types]
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) => formatPokemonName(type.name)),
    pokemonData.height,
    pokemonData.weight,
    generation,
    localizedNames
  );
}

export const useGameStore = defineStore("game", {
  state: () => ({
    minPokedex: 1,
    maxPokedex: 1025,
    currentPokemon: EMPTY_POKEMON(),
    nextPokemon: EMPTY_POKEMON(),
    generations: GENERATIONS,
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
      if (id < this.minPokedex || id > this.maxPokedex) {
        throw new Error(
          `Pokémon not found. Choose an id between ${this.minPokedex} and ${this.maxPokedex}.`
        );
      }

      return fetchJson<PokemonApiResponse>(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
    },

    async getPokemonSpecies(id: number) {
      return fetchJson<PokemonSpeciesResponse>(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
    },

    async loadPokemonNames() {
      if (this.pokemonNames.length || this.isLoadingPokemonNames) return;

      this.isLoadingPokemonNames = true;

      try {
        const species = await fetchJson<PokemonSpeciesListResponse>(
          `https://pokeapi.co/api/v2/pokemon-species?limit=${this.maxPokedex}`
        );

        this.pokemonNames = species.results
          .map(({ name, url }) => ({
            id: Number(url.split("/").filter(Boolean).pop()),
            name: formatPokemonName(name),
          }))
          .filter(({ id }) => id <= this.maxPokedex)
          .sort((a, b) => a.id - b.id);
      } finally {
        this.isLoadingPokemonNames = false;
      }
    },

    async loadPokemon() {
      const requestId = ++this.nextPokemonRequestId;

      while (requestId === this.nextPokemonRequestId) {
        const acceptedPokemonIdRanges = this.acceptedPokemonIdRanges;
        const pokemonId = getRandomAcceptedPokemonId(
          this.minPokedex,
          this.maxPokedex,
          acceptedPokemonIdRanges,
          this.currentPokemon.id
        );

        const [pokemonData, speciesData] = await Promise.all([
          this.getPokemon(pokemonId),
          this.getPokemonSpecies(pokemonId),
        ]);

        if (requestId !== this.nextPokemonRequestId) return;

        if (!isPokemonIdAccepted(pokemonId, this.acceptedPokemonIdRanges)) {
          continue;
        }

        this.nextPokemon = createPokemon(pokemonId, pokemonData, speciesData);
        return;
      }
    },

    setPokemon() {
      this.currentPokemon = this.nextPokemon;
    },

    giveUp() {
      this.inputVal = this.currentPokemon.name;
      this.isGuessCorrect = false;
      this.hasGivenUp = true;
      void this.loadPokemon();
    },
  },

  getters: {
    acceptedPokemonIdRanges(): [number, number][] {
      return getAcceptedPokemonIdRanges(
        this.selectedGenerationIds,
        this.generations
      );
    },

    autocompletePokemonNames(): PokemonNameData[] {
      if (this.acceptedPokemonIdRanges.length === 0) return this.pokemonNames;

      return this.pokemonNames.filter(({ id }) =>
        isPokemonIdAccepted(id, this.acceptedPokemonIdRanges)
      );
    },
  },
});
