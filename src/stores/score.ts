import { defineStore } from "pinia";
import { DifficultyOptions } from "../utilities/interfaces";

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
      this.currentScore++;
    },

    changeScore(difficulty: string) {
      switch (difficulty) {
        case DifficultyOptions.EASY:
          if (this.currentScore > this.easyHighScore) this.newEasyHighScore();
          break;

        default: // normal
          if (this.currentScore > this.normalHighScore)
            this.newNormalHighScore();
      }
    },

    giveUp() {
      this.prevScore = this.currentScore;
      this.currentScore = 0;
    },

    newEasyHighScore() {
      this.easyHighScore = this.currentScore;
    },

    newNormalHighScore() {
      this.easyHighScore = this.currentScore;
    },

    toggleHighScore() {
      this.newHighScore = !this.newHighScore;
    },
  },
});
