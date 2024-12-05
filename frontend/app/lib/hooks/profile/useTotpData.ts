import { TOTPData } from "@/app/lib/types";
import { useEffect, useState } from "react";
import createTotpDevice from "../../queries/createTotpDevice";

export default function useTotpData() {
  const [state, setState] = useState({
    loading: true,
    success: false,
    error: undefined as string | undefined,
  });
  const [totpData, setTotpData] = useState<TOTPData | null>(null);

  useEffect(() => {
    createTotpDevice().then((data) => {
      if (!data) {
        setState({ ...state, loading: false, error: "User is oauth2" });
        return;
      }

      setState({ ...state, loading: false, success: true });
      setTotpData(data);
    });
  }, [state]);

  return {
    loading: state.loading,
    success: state.success,
    error: state.error,
    data: totpData,
  };
}
