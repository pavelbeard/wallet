import { useEffect, useState } from "react";
import { API_PATH } from "../../helpers/constants";
import useDebounce from "../useDebounce";

export default function useUsernameSuggestions(username: string | undefined) {
  const debouncedUsername = useDebounce({
    value: username,
    delay: 500,
    dependencies: [username],
  });
  const [state, setState] = useState({
    error: null as string | null,
    data: null as string | string[] | null,
    loading: true,
    isTaken: false,
  });

  useEffect(() => {
    if (debouncedUsername) {
      fetch(`${API_PATH}/api/users/username_suggestions/`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ username, count: 5 }),
        credentials: "omit",
      })
        .then((response) => {
          if (response instanceof Error)
            throw new Error("Something went wrong...");
          if (response.status !== 200) throw new Error(response.statusText);
          return response;
        })
        .then(async (response) => {
          const data = await response?.json();
          if (Array.isArray(data.username)) {
            setState({
              error: null,
              data: data.username as string[],
              loading: false,
              isTaken: true,
            });
          } else {
            setState({
              error: null,
              data: data.username as string,
              loading: false,
              isTaken: false,
            });
          }
        })
        .catch((error) => {
          setState({
            error: error.message,
            data: null,
            loading: false,
            isTaken: false,
          });
        });
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (
      Array.isArray(state.data) &&
      username &&
      state.data.includes(username)
    ) {
      setState({
        error: null,
        data: null,
        loading: false,
        isTaken: false,
      });
    }
  });

  return {
    error: state.error,
    data: state.data,
    loading: state.loading,
    isTaken: state.isTaken,
  };
}
