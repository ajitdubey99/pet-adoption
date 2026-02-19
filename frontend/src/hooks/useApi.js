/**
 * @fileoverview Generic async API hook with loading and error state.
 */

import { useState, useCallback } from "react";

/**
 * Wraps an async API function with loading/error state management.
 *
 * @param {Function} apiFn - Async function from services.js
 * @returns {{ data, loading, error, execute, clearError }}
 *
 * @example
 * const { data, loading, execute } = useApi(getPets);
 * useEffect(() => { execute({ status: 'available' }); }, []);
 */
const useApi = (apiFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const clearError = useCallback(() => setError(null), []);

  return { data, loading, error, execute, clearError };
};

export default useApi;
