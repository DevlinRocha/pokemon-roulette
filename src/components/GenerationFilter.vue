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

    selectGeneration(id: number) {
      this.$emit("update:modelValue", !this.isChecked(id) ? [...this.modelValue, id] : this.modelValue.filter((number) => number !== id));
    },
  },
});
</script>

<template>
  <div>
    <div v-for="generation in generations" :key="generation.id">
      <label :for="`gen${generation.id}`">{{ generation.name }}</label>

      <input :id="`gen${generation.id}`" :checked="isChecked(generation.id)" type="checkbox" @change="selectGeneration(generation.id)" />
    </div>
  </div>
</template>
