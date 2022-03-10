<script lang="ts">
import { defineComponent } from "vue";

interface GenerationData {
  name: string;
  range: [number, number];
  isChecked: boolean;
}

export default defineComponent({
  mounted() {
    console.log(this.generations);
  },

  data() {
    return {
      generations: [
        {
          name: "Gen I",
          range: [1, 151],
          isChecked: true,
        },
        {
          name: "Gen II",
          range: [152, 251],
          isChecked: true,
        },
        {
          name: "Gen III",
          range: [252, 386],
          isChecked: true,
        },
        {
          name: "Gen IV",
          range: [387, 493],
          isChecked: true,
        },
        {
          name: "Gen V",
          range: [494, 649],
          isChecked: true,
        },
        {
          name: "Gen VI",
          range: [650, 721],
          isChecked: true,
        },
        {
          name: "Gen VII",
          range: [722, 809],
          isChecked: true,
        },
        {
          name: "Gen VIII",
          range: [810, 905],
          isChecked: true,
        },
      ] as GenerationData[],
    };
  },

  methods: {
    getPokedexRange(generations: GenerationData[]) {
      console.log(generations);
    },
  },
});
</script>

<template>
  <div>
    <div v-for="(generation, index) in generations" :key="index">
      <label :for="`gen${index}`">{{ generation.name }}</label>

      <input
        :id="`gen${index}`"
        type="checkbox"
        :checked="generation.isChecked"
        :v-model="!generation.isChecked"
        @change="getPokedexRange(generations)"
      />
    </div>
  </div>
</template>
