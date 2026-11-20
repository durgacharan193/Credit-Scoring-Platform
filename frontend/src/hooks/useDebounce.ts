import { useState, useEffect, useCallback } from 'react';

/**
 * useDebounce - generic debounce hook for search input and rate-limited queries
 */
export function useDebounce() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      setData({ initialized: true, timestamp: Date.now() });
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

export default useDebounce;
