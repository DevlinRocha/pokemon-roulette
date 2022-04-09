<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GenerationData } from "../utilities/interfaces";
import { useScoreStore } from "../stores/score";

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<Number[]>,
      required: true,
    },
    generations: {
      type: Array as PropType<GenerationData[]>,
      required: true,
    },
  },

  methods: {
    isChecked(id: number) {
      return this.modelValue.includes(id);
    },

    toggleGeneration(id: number) {
      if (!this.confirmToggle()) {
        const inputs = this.$refs.inputRef as HTMLInputElement[];
        return (inputs[id - 1].checked = !inputs[id - 1].checked);
      }

      this.$emit(
        "update:modelValue",
        !this.isChecked(id)
          ? [...this.modelValue, id]
          : this.modelValue.filter((number) => number !== id)
      );
      this.$emit("toggleGeneration");
    },

    confirmToggle() {
      if (this.scoreStore.currentScore <= 0) return true;

      return confirm(
        "Changing Pokémon generations will reset your current score, are you sure?"
      );
    },

    isToggleValid(id: number) {
      if (this.modelValue.length <= 1 && this.isChecked(id)) return false;
      return true;
    },
  },

  computed: {
    scoreStore: () => useScoreStore(),
  },
});
</script>

<template>
  <div>
    <div
      v-for="generation in generations"
      class="generation"
      :key="generation.id"
    >
      <label :for="`gen${generation.id}`">{{ generation.name }}</label>

      <input
        :id="`gen${generation.id}`"
        :checked="isChecked(generation.id)"
        type="checkbox"
        :disabled="!isToggleValid(generation.id)"
        @change="toggleGeneration(generation.id)"
        ref="inputRef"
      />
    </div>
  </div>
</template>

<style scoped>
.generation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: max-content;
  width: 100px;
}

label {
  padding-right: 4px;
}
</style>
