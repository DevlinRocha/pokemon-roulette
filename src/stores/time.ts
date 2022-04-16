import { defineStore } from "pinia";

export const useTimeStore = defineStore("score", {
  state: () => ({
    prevTime: -1,
    currentTime: 0,
    bestEasyTime: -1,
    bestNormalTime: -1,
    bestEasyPokemon: "",
    bestNormalPokemon: "",
    newBestTime: false,
  }),
});
