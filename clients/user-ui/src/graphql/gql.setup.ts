// //
// import {
//   ApolloClient,
//   ApolloLink,
//   InMemoryCache,
//   createHttpLink,
// } from "@apollo/client";
// import Cookies from "js-cookie";

// const httpLink = createHttpLink({
//   uri: process.env.NEXT_PUBLIC_GATEWAY_URI,
//   credentials: "same-origin",
// });

// const authMiddleware = new ApolloLink((operation, forward) => {
//   console.log("accessToken:", Cookies.get("access_token"));
//   console.log("refreshToken:", Cookies.get("refresh_token"));

//   const accessToken = Cookies.get("access_token");
//   const refreshToken = Cookies.get("refresh_token");

//   operation.setContext({
//     headers: {
//       accesstoken: accessToken ? accessToken : "",
//       refreshtoken: refreshToken ? refreshToken : "",
//     },
//   });
//   return forward(operation);
// });

// export const graphqlClient = new ApolloClient({
//   link: authMiddleware.concat(httpLink),
//   cache: new InMemoryCache(),
// });
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GATEWAY_URI,
});

const authLink = setContext((_, { headers }) => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  // console.log("Setting headers:", {
  //   accesstoken: accessToken,
  //   refreshtoken: refreshToken,
  // });

  return {
    headers: {
      ...headers,
      accesstoken: accessToken ? accessToken : "",
      refreshtoken: refreshToken ? refreshToken : "",
    },
  };
});

export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
