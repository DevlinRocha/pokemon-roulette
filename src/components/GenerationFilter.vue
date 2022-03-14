<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GenerationData } from "../App.vue";

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
      this.isToggleValid(id)
        ? this.$emit(
            "update:modelValue",
            !this.isChecked(id)
              ? [...this.modelValue, id]
              : this.modelValue.filter((number) => number !== id)
          )
        : null;
    },

    isToggleValid(id: number) {
      if (this.modelValue.length <= 1 && this.isChecked(id)) return false;
      return true;
    },
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
