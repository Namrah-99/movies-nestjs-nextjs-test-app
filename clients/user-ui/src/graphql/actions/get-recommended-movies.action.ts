"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_RECOMMENDED_MOVIES: DocumentNode = gql`
  mutation RecommendedMovies($userId: String!) {
    recommendedMoviesfromuser(userId: $userId) {
      id
      movie {
        title
        category {
          name
        }
        ratings {
          value
        }
      }
      user {
        id
        name
        email
        image
        role
      }
    }
  }
`;

// export const GET_RECOMMENDED_MOVIES: DocumentNode = gql`
// query {
//     recommendedMovies ($userId: String!) {
//         id
//         movie {
//             title
//             category {
//                 name
//             }
//             ratings {
//                 value
//             }
//         }
//         user {
//             id
//             name
//             email
//             image
//             role
//         }
//     }
//   }
// `;
