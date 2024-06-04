import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/actions/getUser.action";
import Cookies from "js-cookie";

const useUser = () => {
  // const { loading, data } = useQuery(GET_USER);
  const { loading, error, data } = useQuery(GET_USER, {
    onCompleted: (data) => {
      if (data?.getLoggedInUser?.accessToken) {
        Cookies.set("access_token", data.getLoggedInUser.accessToken);
        Cookies.set("refresh_token", data.getLoggedInUser.refreshToken);
      }
    },
  });
  return {
    loading,
    user: data?.getLoggedInUser?.user,
  };
};

export default useUser;
