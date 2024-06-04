"use client";

import { gql, DocumentNode } from "@apollo/client";

export const RATE_MOVIE_FROM_USER: DocumentNode = gql`
  mutation RateMovieFromUser(
    $value: Float!
    $userId: String!
    $movieId: String!
  ) {
    rateMovieFromUser(value: $value, userId: $userId, movieId: $movieId) {
      id
      value
      user {
        id
        name
        email
        phone_number
        address
        role
        image
        dob
        createdAt
        updatedAt
      }
      movie {
        id
        title
        category {
          id
          name
        }
        ratings {
          id
          value
        }
        recommendedMovies {
          id
          userId
          movieId
        }
      }
    }
  }
`;
