import { useEffect, useState, useCallback } from 'react';

/**
 * Hook generik untuk memanggil function service (bukan fetch langsung)
 * dan mengelola state loading / error / data secara konsisten.
 *
 * @param {Function} serviceFn - function dari folder services/ yang mengembalikan Promise
 * @param {Array} deps - dependency array, sama seperti useEffect
 */
export default function useFetch(serviceFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
