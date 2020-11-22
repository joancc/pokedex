<template>
  <article
    class="relative flex flex-col justify-between h-full border border-gray-300 rounded-lg card"
    :class="{ flip }"
  >
    <div
      class="flex flex-col justify-between h-full bg-white rounded-t-lg face"
    >
      <div class="flex items-center justify-center h-full p-4">
        <img
          :src="pokemon.image"
          :alt="`Image of ${pokemon.name}`"
          class="w-full max-h-64"
        />
      </div>
      <div class="flex items-center justify-between p-4 bg-gray-300 rounded-b">
        <router-link :to="{ name: 'detail', params: { id: pokemon.id } }">
          <p class="font-bold">
            {{ pokemon.name }}
          </p>
          <p class="text-xs">
            {{ pokemon.classification }}
          </p>
        </router-link>
        <div>
          <button
            class="w-5 h-5 text-red-900"
            @click="pokemon.isFavorite ? unfavorite(pokemon.id) : favorite(pokemon.id)"
          >
            <svg
              v-if="pokemon.isFavorite"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="canFlip"
      class="absolute flex flex-col items-center justify-center h-full bg-white rounded-t-lg back"
    >
      <p class="text-lg font-bold">Attacks</p>
      <ul v-if="pokemon.attacks.fast">
        <li v-for="attack in pokemon.attacks.fast" :key="attack.name">
          {{ attack.name }} - {{ attack.damage }} - {{ attack.type }}
        </li>
      </ul>
      <hr />
      <ul v-if="pokemon.attacks.special">
        <li v-for="attack in pokemon.attacks.special" :key="attack.name">
          {{ attack.name }} - {{ attack.damage }} - {{ attack.type }}
        </li>
      </ul>
    </div>
    <button
      v-if="canFlip"
      class="absolute top-0 right-0 w-4 h-4 m-2 text-green-500"
      :class="{ hidden: flip }"
      @click.stop.capture="flip = !flip"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
    <button
      class="absolute top-0 left-0 w-4 h-4 m-2 text-green-500"
      style="transform: rotateY(180deg);"
      :class="{ hidden: !flip }"
      @click="flip = !flip"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    </button>
  </article>
</template>

<script>
export default {
  name: "PokemonCard",
  props: {
    pokemon: Object,
    favorite: Function,
    unfavorite: Function,
    canFlip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flip: false
    };
  }
};
</script>
<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.face {
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}

.card.flip {
  transform: rotateY(180deg);
}
</style>
