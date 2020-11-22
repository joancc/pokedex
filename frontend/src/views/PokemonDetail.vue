<template>
  <div v-if="pokemonById" class="max-w-3xl mx-auto mt-8">
    <div class="flex flex-col">
      <div class="relative w-full">
        <img
          class="mx-auto h-2/3"
          :src="pokemonById.image"
          :alt="`Pokemon image for ${pokemonById.name}`"
        />
        <audio ref="pokemonAudio">
          <source :src="pokemonById.sound" />
        </audio>
        <button
          class="absolute bottom-0 left-0 w-5 h-5 m-4 text-green-500"
          @click="$refs.pokemonAudio.play()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="p-4 mt-4 bg-gray-200 border">
      <div class="flex justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ pokemonById.name }}</h1>
          <p>{{ pokemonById.classification }}</p>
        </div>
        <div>
          <button
            class="w-5 h-5 text-red-900"
            @click="
              pokemonById.isFavorite
                ? unfavorite(pokemonById.id)
                : favorite(pokemonById.id)
            "
          >
            <svg
              v-if="pokemonById.isFavorite"
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
      <div class="flex items-center">
        <div class="w-full h-2 bg-purple-500 rounded-xl"></div>
        <p class="flex-shrink-0 ml-4 font-bold">CP: {{ pokemonById.maxCP }}</p>
      </div>
      <div class="flex items-center">
        <div class="w-full h-2 bg-green-500 rounded-xl"></div>
        <p class="flex-shrink-0 ml-4 font-bold">HP: {{ pokemonById.maxHP }}</p>
      </div>
    </div>
    <div class="mt-4" v-if="pokemonById.evolutions.length > 0">
      <h2 class="font-bold">Evolutions</h2>
      <div class="grid grid-cols-4 gap-4 ">
        <PokemonCard
          v-for="pokemon in pokemonById.evolutions"
          :key="pokemon.id"
          :pokemon="pokemon"
          :favorite="favorite"
          :unfavorite="unfavorite"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { GET_POKEMON } from "../queries";
import { FAVORITE_POKEMON, UNFAVORITE_POKEMON } from "../mutations";
import PokemonCard from "@/components/PokemonCard";

export default {
  name: "PokemonDetail",
  apollo: {
    pokemonById: {
      query: GET_POKEMON,
      variables() {
        return this.variables;
      }
    }
  },
  data() {
    return {
      variables: {
        id: this.$route.params.id
      }
    };
  },
  methods: {
    favorite(pokemonId) {
      this.$apollo.mutate({
        mutation: FAVORITE_POKEMON,
        variables: {
          id: pokemonId
        },
        update: (store, { data: { favoritePokemon } }) => {
          // Read the data from our cache for this query.
          const variables = this.variables;
          const data = store.readQuery({ query: GET_POKEMON, variables });

          const updatedPokemon = data.pokemonById;
          if (favoritePokemon) {
            updatedPokemon.isFavorite = favoritePokemon.isFavorite;
            store.writeQuery({ query: GET_POKEMON, data, variables });
          }
        },
        optimisticResponse: {
          isFavorite: true,
          __typename: "Pokemon"
        }
      });
    },
    unfavorite(pokemonId) {
      this.$apollo.mutate({
        mutation: UNFAVORITE_POKEMON,
        variables: {
          id: pokemonId
        },
        update: (store, { data: { unFavoritePokemon } }) => {
          // Read the data from our cache for this query.
          const variables = this.variables;
          const data = store.readQuery({ query: GET_POKEMON, variables });
          const updatedPokemon = data.pokemonById;
          if (unFavoritePokemon) {
            updatedPokemon.isFavorite = unFavoritePokemon.isFavorite;
            store.writeQuery({ query: GET_POKEMON, data, variables });
          }
        },
        optimisticResponse: {
          isFavorite: false,
          __typename: "Pokemon"
        }
      });
    }
  },
  components: {
    PokemonCard
  }
};
</script>
