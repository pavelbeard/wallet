import { useEffect, useState } from "react";
import getUsernameSuggestions from "../../queries/profile/getUsernameSuggestions";
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
      // TODO: replace with query
      getUsernameSuggestions(debouncedUsername as string).then(
        ({ error, data, loading, isTaken }) => {
          setState({
            error,
            data,
            loading,
            isTaken,
          });
        },
      );
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
  }, [state?.data, username]);

  return {
    error: state.error,
    data: state.data,
    loading: state.loading,
    isTaken: state.isTaken,
  };
}
