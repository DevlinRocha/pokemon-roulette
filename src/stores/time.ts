import { defineStore } from "pinia";
import { DifficultyOptions } from "../utilities/interfaces";
import { useGameStore } from "./game";

export const useTimeStore = defineStore("time", {
  state: () => ({
    prevTime: -1,
    currentTime: 0,
    bestEasyTime: -1,
    bestNormalTime: -1,
    bestEasyPokemon: "",
    bestNormalPokemon: "",
    newBestTime: false,
  }),

  actions: {
    changeTime() {
      switch (this.gameStore.difficulty) {
        case DifficultyOptions.EASY:
          if (this.bestEasyTime !== -1 && this.prevTime > this.bestEasyTime)
            return;
          this.bestEasyTime = this.prevTime;
          this.bestEasyPokemon = this.gameStore.currentPokemon.name;
          this.newBestTime = true;
          break;

        default: // normal
          if (this.bestNormalTime !== -1 && this.prevTime > this.bestNormalTime)
            return;
          this.bestNormalTime = this.prevTime;
          this.bestNormalPokemon = this.gameStore.currentPokemon.name;
          this.newBestTime = true;
      }
    },
  },

  getters: {
    gameStore: () => useGameStore(),

    bestTime: ({
      bestEasyTime,
      bestEasyPokemon,
      bestNormalTime,
      bestNormalPokemon,
    }) => {
      const game = useGameStore();
      switch (game.difficulty) {
        case DifficultyOptions.EASY:
          if (bestEasyTime === -1) return "---";

          return `${bestEasyTime} ${bestEasyPokemon && `(${bestEasyPokemon})`}`;
        default: // normal
          if (bestNormalTime === -1) return "---";

          return `${bestNormalTime} ${
            bestNormalPokemon && `(${bestNormalPokemon})`
          }`;
      }
    },
  },
});
