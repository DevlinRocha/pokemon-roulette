<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useGameStore } from "../stores/game";

const typeColors: Record<string, string> = {
  normal: "#a8a77a",
  fire: "#ee8130",
  water: "#6390f0",
  electric: "#f7d02c",
  grass: "#7ac74c",
  ice: "#96d9d6",
  fighting: "#c22e28",
  poison: "#a33ea1",
  ground: "#e2bf65",
  flying: "#a98ff3",
  psychic: "#f95587",
  bug: "#a6b91a",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fc",
  dark: "#705746",
  steel: "#b7b7ce",
  fairy: "#d685ad",
};

export default defineComponent({
  computed: {
    ...mapStores(useGameStore),

    isVisible(): boolean {
      return (
        !!this.gameStore.currentPokemon.id &&
        (this.gameStore.isGuessCorrect || this.gameStore.hasGivenUp)
      );
    },

    accentColor(): string {
      const primaryType = this.gameStore.currentPokemon.types?.[0];
      return typeColors[primaryType?.toLowerCase()] || "var(--secondary-color)";
    },

    pokemonNumber(): string {
      return `#${String(this.gameStore.currentPokemon.id).padStart(4, "0")}`;
    },

    formattedHeight(): string {
      return `${(this.gameStore.currentPokemon.height / 10).toFixed(1)} m`;
    },

    formattedWeight(): string {
      return `${(this.gameStore.currentPokemon.weight / 10).toFixed(1)} kg`;
    },
  },
});
</script>

<template>
  <section
    v-if="isVisible"
    class="pokemon-info-card"
    :style="{ '--accent-color': accentColor }"
  >
    <div class="card-body">
      <div class="pokemon-summary">
        <div class="card-header">
          <h2>{{ gameStore.currentPokemon.name }}</h2>
          <span class="pokemon-number">{{ pokemonNumber }}</span>
        </div>
        <div class="type-pills">
          <span
            v-for="type in gameStore.currentPokemon.types"
            :key="type"
            :class="['type-pill', type.toLowerCase()]"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <dl class="stat-grid">
        <div>
          <dt>Height</dt>
          <dd>{{ formattedHeight }}</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{{ formattedWeight }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.pokemon-info-card {
  width: min(100%, 34rem);
  margin-top: 20px;
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(27, 83, 186, 0.14);
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(135deg, color-mix(in srgb, var(--accent-color) 22%, white), #ffffff 58%);
  box-shadow:
    0 18px 30px rgba(27, 83, 186, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-label,
.pokemon-number {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card-label {
  color: #fff;
  background-color: var(--accent-color);
}

.pokemon-number {
  color: var(--secondary-color);
  background-color: rgba(255, 255, 255, 0.78);
}

.card-body {
  display: grid;
  gap: 18px;
}

.pokemon-summary h2 {
  margin-bottom: 10px;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
}

.type-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-pill {
  padding: 6px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.18);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-grid div {
  padding: 12px 14px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
}

.stat-grid dt {
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(44, 62, 80, 0.78);
}

.stat-grid dd {
  font-size: 1rem;
  font-weight: 700;
}

.normal {
  background-color: #a8a77a;
}

.fire {
  background-color: #ee8130;
}

.water {
  background-color: #6390f0;
}

.electric {
  background-color: #f7d02c;
}

.grass {
  background-color: #7ac74c;
}

.ice {
  background-color: #96d9d6;
}

.fighting {
  background-color: #c22e28;
}

.poison {
  background-color: #a33ea1;
}

.ground {
  background-color: #e2bf65;
}

.flying {
  background-color: #a98ff3;
}

.psychic {
  background-color: #f95587;
}

.bug {
  background-color: #a6b91a;
}

.rock {
  background-color: #b6a136;
}

.ghost {
  background-color: #735797;
}

.dragon {
  background-color: #6f35fc;
}

.dark {
  background-color: #705746;
}

.steel {
  background-color: #b7b7ce;
}

.fairy {
  background-color: #d685ad;
}

@media (max-width: 640px) {
  .pokemon-info-card {
    padding: 16px;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
