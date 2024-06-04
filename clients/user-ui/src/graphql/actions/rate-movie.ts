"use client";
import { gql, DocumentNode } from "@apollo/client";

export const RATE_MOVIE: DocumentNode = gql`
  mutation RateMovie($value: Int!, $userId: String!, $movieId: String!) {
    rateMovieFromUser(userId: $userId, movieId: $movieId, value: $value) {
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
