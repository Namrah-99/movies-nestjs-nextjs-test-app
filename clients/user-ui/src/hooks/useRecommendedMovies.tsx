// import { useMutation } from "@apollo/client";
// import { GET_RECOMMENDED_MOVIES } from "../graphql/actions/get-recommended-movies.action";
// import useUser from "./useUser";
// import toast from "react-hot-toast";

// const useRecommendedMovies = () => {
//   const { user } = useUser();
//   const [recommendedMoviesfromuser, { loading }] = useMutation(
//     GET_RECOMMENDED_MOVIES
//   );
//   // recommendedMoviesfromuser({
//   //   variables: { userId: user.id },
//   // }).then((response) => {
//   //   console.log(response?.data);
//   // });
//   recommendedMoviesfromuser({
//     variables: { userId: user.id },
//   })
//     .then((response) => {
//       console.log(response?.data);
//       return {
//         loading,
//         recommended_movies: response?.data?.recommendedMoviesfromuser,
//       };
//     })
//     .catch((error) => {
//       console.log(error);
//       toast.error("Error fetching recommended movies");
//     });

//   // return {
//   //   loading,
//   //   // recommended_movies: data?.recommendedMoviesfromuser,
//   // };
// };

// export default useRecommendedMovies;
import { useMutation } from "@apollo/client";
import { GET_RECOMMENDED_MOVIES } from "../graphql/actions/get-recommended-movies.action";
import useUser from "./useUser";
import toast from "react-hot-toast";
import { useEffect } from "react";

const useRecommendedMovies = () => {
  const { user } = useUser();
  const [getRecommendedMovies, { data, loading, error }] = useMutation(
    GET_RECOMMENDED_MOVIES,
    {
      variables: { userId: user?.id },
      onError: () => {
        toast.error("Error fetching recommended movies");
      },
    }
  );

  useEffect(() => {
    if (user?.id) {
      getRecommendedMovies();
    }
  }, [user, getRecommendedMovies]);

  return {
    loading,
    user,
    recommendedMovies: data?.recommendedMoviesfromuser,
  };
};

export default useRecommendedMovies;
