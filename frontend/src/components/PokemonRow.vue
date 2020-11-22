<template>
  <li
    class="flex justify-between mt-2 bg-gray-100 border border-gray-100 rounded-lg"
  >
    <div class="flex items-center">
      <div
        class="flex items-center justify-center w-20 h-20 bg-white bg-center bg-no-repeat bg-contain rounded-l-lg"
        :style="`background-image: url(${pokemon.image})`"
      ></div>
      <div class="ml-4">
        <p class="font-bold">
          {{ pokemon.name }}
        </p>
        <p class="text-xs">
          {{ pokemon.classification }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button
        class="w-5 h-5 mx-4 text-red-900"
        @click="
          pokemon.isFavorite ? unfavorite(pokemon.id) : favorite(pokemon.id)
        "
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
  </li>
</template>

<script>
export default {
  name: "PokemonCard",
  props: {
    pokemon: Object,
    favorite: Function,
    unfavorite: Function
  }
};
</script>
