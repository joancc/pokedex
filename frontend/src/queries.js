import gql from "graphql-tag";

export const GET_POKEMONS = gql`
  query POKEMONS($input: PokemonsQueryInput!) {
    pokemons(query: $input) {
      count
      edges {
        id
        name
        image
        classification
        isFavorite
        types
        attacks {
          fast {
            name
            type
            damage
          }
          special {
            name
            type
            damage
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_TYPES = gql`
  query POKEMON_TYPES {
    pokemonTypes
  }
`;

export const GET_POKEMON = gql`
  query POKEMON($id: ID!) {
    pokemonById(id: $id) {
      id
      name
      image
      classification
      isFavorite
      types
      sound
      maxCP
      maxHP
      evolutions {
        name
        isFavorite
        image
        id
      }
    }
  }
`;
