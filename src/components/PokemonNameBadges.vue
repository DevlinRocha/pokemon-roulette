<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useGameStore } from "../stores/game";

export default defineComponent({
  computed: {
    ...mapStores(useGameStore),

    isVisible(): boolean {
      return (
        !!this.gameStore.currentPokemon.id &&
        !!this.gameStore.currentPokemon.localizedNames.length &&
        (this.gameStore.isGuessCorrect || this.gameStore.hasGivenUp)
      );
    },
  },
});
</script>

<template>
  <section v-if="isVisible" class="pokemon-name-badges">
    <div class="badge-list">
      <article
        v-for="localizedName in gameStore.currentPokemon.localizedNames"
        :key="localizedName.language"
        :title="localizedName.language"
        class="name-badge"
      >
        <span class="badge-flag" aria-hidden="true">{{ localizedName.flag }}</span>
        <strong>{{ localizedName.name }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pokemon-name-badges {
  width: min(100%, 34rem);
  margin-top: 18px;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.name-badge {
  display: flex;
  gap: 0.5rem;
  min-width: 9.5rem;
  padding: 10px 12px;
  border: 1px solid rgba(27, 83, 186, 0.12);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 249, 255, 0.95));
  box-shadow: 0 10px 22px rgba(27, 83, 186, 0.08);
}

.badge-language {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(44, 62, 80, 0.66);
}

.badge-flag {
  font-size: 0.95rem;
}

.name-badge strong {
  font-size: 0.98rem;
  line-height: 1.2;
  color: #1a2a3a;
}
</style>
