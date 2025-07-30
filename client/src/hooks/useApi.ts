import { useState, useCallback, useEffect } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

export function useApi<T, P extends any[]>(
  apiFunction: ApiFunction<T, P>,
  immediate = false,
  ...immediateArgs: P
): [ApiState<T>, (...args: P) => Promise<T>, () => void] {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorObject =
          error instanceof Error
            ? error
            : new Error("An unknown error occurred");
        setState({ data: null, loading: false, error: errorObject });
        throw errorObject;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(...immediateArgs).catch(() => {
        // Error is already handled in execute
      });
    }
  }, [execute, immediate, immediateArgs]);

  return [state, execute, reset];
}

export default useApi;
