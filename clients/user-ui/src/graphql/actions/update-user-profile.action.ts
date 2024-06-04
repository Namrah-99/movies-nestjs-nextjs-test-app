import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_USER_PROFILE: DocumentNode = gql`
  mutation updateProfile(
    $name: String
    $phone_number: Float
    $address: String
    $image: String
    $dob: DateTime
    $categories: [String!]
  ) {
    updateProfile(
      updateProfileDto: {
        name: $name
        phone_number: $phone_number
        address: $address
        image: $image
        dob: $dob
        categories: $categories
      }
    ) {
      user {
        name
        email
        phone_number
        address
        image
        dob
        categories {
          id
          name
          users {
            name
            email
            role
          }
          movies {
            title
            ratings {
              value
            }
          }
        }
        createdAt
      }
      error {
        message
      }
    }
  }
`;
