import gql from "graphql-tag";

export const FAVORITE_POKEMON = gql`
  mutation FavoritePokemon($id: ID!) {
    favoritePokemon(id: $id) {
      isFavorite
    }
  }
`;

export const UNFAVORITE_POKEMON = gql`
  mutation UnFavoritePokemon($id: ID!) {
    unFavoritePokemon(id: $id) {
      isFavorite
    }
  }
`;
