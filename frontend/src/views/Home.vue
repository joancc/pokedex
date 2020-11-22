<template>
  <div class="container mx-auto">
    <nav class="py-4 border-b">
      <div class="flex">
        <button
          @click="toggleFavorites(false)"
          class="w-full h-10 p-2"
          :class="{
            'text-white bg-green-500': !isFavorite,
            'text-green-500 border border-green-500': isFavorite
          }"
        >
          All
        </button>
        <button
          @click="toggleFavorites(true)"
          class="w-full h-10 p-2"
          :class="{
            'text-white bg-green-500': isFavorite,
            'text-green-500 border border-green-500': !isFavorite
          }"
        >
          Favorites
        </button>
      </div>
      <div class="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search"
          v-model="search"
          class="w-full h-10 p-2 bg-gray-100 rounded-lg"
        />
        <select
          name="type"
          id="type"
          class="w-full h-10 p-2 ml-4 bg-gray-100 rounded-lg"
          v-model="type"
        >
          <option value="">Type...</option>
          <option v-for="type in pokemonTypes" :key="type" :value="type">{{
            type
          }}</option>
        </select>
        <button
          class="w-20 h-20 ml-4 text-green-500"
          @click="displayGrid = false"
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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </button>
        <button
          class="w-20 h-20 ml-4 text-green-500"
          @click="displayGrid = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
      </div>
    </nav>
    <div v-if="!$apollo.loading && pokemons.edges.length === 0">
      No results found
    </div>
    <div v-if="pokemons">
      <div v-if="displayGrid" class="grid grid-cols-6 gap-4 mt-4">
        <PokemonCard
          v-for="pokemon in pokemons.edges"
          :key="pokemon.id"
          :pokemon="pokemon"
          :favorite="favorite"
          :unfavorite="unfavorite"
          can-flip
        />
      </div>
      <ul v-else>
        <PokemonRow
          v-for="pokemon in pokemons.edges"
          :key="pokemon.id"
          :pokemon="pokemon"
          :favorite="favorite"
          :unfavorite="unfavorite"
        />
      </ul>
      <IntersectionObserver
        :key="pokemons.edges.length"
        :callback="fetchMorePokemons"
      />
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import PokemonCard from "@/components/PokemonCard";
import PokemonRow from "@/components/PokemonRow";
import IntersectionObserver from "@/components/IntersectionObserver";
import { GET_POKEMONS, GET_POKEMON_TYPES } from "../queries";
export default {
  name: "home",
  apollo: {
    pokemonTypes: {
      query: GET_POKEMON_TYPES
    },
    pokemons: {
      query: GET_POKEMONS,
      variables() {
        return this.variables;
      }
    },
    pokemonByName: {
      query: gql`
        query PokemonByName($input: String!) {
          pokemonByName(name: $input) {
            sound
          }
        }
      `,
      variables: {
        input: ""
      }
    }
  },
  data() {
    return {
      offset: 0,
      isFavorite: false,
      search: "",
      type: "",
      displayGrid: true
    };
  },
  computed: {
    variables() {
      return {
        input: {
          offset: 0,
          search: this.search,
          filter: {
            type: this.type,
            isFavorite: this.isFavorite
          }
        }
      };
    }
  },
  watch: {
    isFavorite(newVal) {
      if (newVal) {
        // Refetch query when revisiting Favorites in case a new one was last favorited
        this.$nextTick(() => {
          this.$apollo.queries.pokemons.refetch();
        });
      }
    },
    pokemons: function(newPokemons) {
      if (newPokemons.edges) {
        this.offset = newPokemons.edges.length;
      }
    }
  },
  methods: {
    toggleFavorites(val) {
      this.isFavorite = val;
    },
    favorite(pokemonId) {
      this.$apollo.mutate({
        mutation: gql`
          mutation FavoritePokemon($id: ID!) {
            favoritePokemon(id: $id) {
              isFavorite
            }
          }
        `,
        variables: {
          id: pokemonId
        },
        update: (store, { data: { favoritePokemon } }) => {
          // Read the data from our cache for this query.
          if (!favoritePokemon)  return

          const variables = {
            input: {
              offset: 0,
              search: this.search,
              filter: {
                type: "",
                isFavorite: this.isFavorite
              }
            }
          };
          const data = store.readQuery({ query: GET_POKEMONS, variables });

          const updatedPokemon = data.pokemons.edges.find(
            p => p.id === pokemonId
          );
          if (favoritePokemon) {
            updatedPokemon.isFavorite = favoritePokemon.isFavorite;
            store.writeQuery({ query: GET_POKEMONS, data, variables });
          }
        },
        // // Optimistic UI
        // // Will be treated as a 'fake' result as soon as the request is made
        // // so that the UI can react quickly and the user be happy
        optimisticResponse: {
          isFavorite: true,
          __typename: "Pokemon"
        }
      });
    },
    unfavorite(pokemonId) {
      this.$apollo.mutate({
        mutation: gql`
          mutation UnfavoritePokemon($id: ID!) {
            unFavoritePokemon(id: $id) {
              isFavorite
            }
          }
        `,
        variables: {
          id: pokemonId
        },
        update: (store, { data: { unFavoritePokemon } }) => {
          // Read the data from our cache for this query.
          const variables = {
            input: {
              offset: 0,
              search: this.search,
              filter: {
                type: "",
                isFavorite: this.isFavorite
              }
            }
          };
          const data = store.readQuery({ query: GET_POKEMONS, variables });
          const updatedPokemon = data.pokemons.edges.find(
            p => p.id === pokemonId
          );
          if (unFavoritePokemon) {
            updatedPokemon.isFavorite = unFavoritePokemon.isFavorite;
            store.writeQuery({ query: GET_POKEMONS, data, variables });
          }
          window.unFavoritePokemon = unFavoritePokemon;
          window.data = data;
          // // Add our tag from the mutation to the end
          // data.tags.push(addTag)
          // // Write our data back to the cache.
        },
        // // Optimistic UI
        // // Will be treated as a 'fake' result as soon as the request is made
        // // so that the UI can react quickly and the user be happy
        optimisticResponse: {
          isFavorite: false,
          __typename: "Pokemon"
        }
      });
    },
    fetchMorePokemons() {
      if (this.pokemons && this.pokemons.edges.length >= this.pokemons.count)
        return;
      // Fetch more data and transform the original result
      this.$apollo.queries.pokemons.fetchMore({
        variables: {
          input: {
            offset: this.offset,
            search: this.search,
            filter: {
              type: "",
              isFavorite: this.isFavorite
            }
          }
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            pokemons: {
              __typename: previousResult.pokemons.__typename,
              // Merging the tag list
              edges: [
                ...previousResult.pokemons.edges,
                ...fetchMoreResult.pokemons.edges
              ]
            }
          };
        }
      });
    }
  },
  components: {
    PokemonCard,
    PokemonRow,
    IntersectionObserver
  }
};
</script>
