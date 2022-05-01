import { defineStore } from "pinia";
import { DifficultyOptions } from "../utilities/interfaces";
import { useGameStore } from "./game";

export const useScoreStore = defineStore("score", {
  state: () => ({
    prevScore: 0,
    currentScore: 0,
    easyHighScore: 0,
    normalHighScore: 0,
    newHighScore: false,
  }),
  actions: {
    correctGuess() {
      return this.currentScore++;
    },

    changeScore(difficulty: string) {
      switch (difficulty) {
        case DifficultyOptions.EASY:
          if (this.currentScore > this.easyHighScore)
            return this.newEasyHighScore();
          break;

        default: // normal
          if (this.currentScore > this.normalHighScore)
            return this.newNormalHighScore();
      }
    },

    giveUp() {
      this.changeScore(this.gameStore.difficulty);
      this.prevScore = this.currentScore;
      return (this.currentScore = 0);
    },

    newEasyHighScore() {
      return (this.easyHighScore = this.currentScore);
    },

    newNormalHighScore() {
      return (this.normalHighScore = this.currentScore);
    },

    highScore() {
      return this[`${this.gameStore.difficulty}HighScore`];
    },
  },
  getters: {
    gameStore: () => useGameStore(),
  },
});
