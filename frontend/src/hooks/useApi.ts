import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

interface UseApiWithRetryReturn<T> extends UseApiReturn<T> {
  retry: () => void;
  retryCount: number;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState({
          data: result,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiWithRetry<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  retryCount = 3,
  retryDelay = 1000
): UseApiWithRetryReturn<T> {
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const retry = useCallback(() => {
    setRetryAttempt(prev => prev + 1);
  }, []);
  
  const executeWithRetry = useCallback(
    async (...args: any[]) => {
      for (let i = 0; i < retryCount; i++) {
        try {
          return await apiFunction(...args);
        } catch (error) {
          if (i === retryCount - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    },
    [apiFunction, retryCount, retryDelay]
  );
  
  const apiState = useApi(executeWithRetry);
  
  return { 
    ...apiState, 
    retry, 
    retryCount: retryAttempt 
  } as UseApiWithRetryReturn<T>;
}

// Spezialisierte Hooks für häufige API-Operationen
export function useGet<T>(apiFunction: () => Promise<T>) {
  return useApi(apiFunction);
}

export function usePost<T, D = any>(apiFunction: (data: D) => Promise<T>) {
  return useApi(apiFunction);
}

export function usePut<T, D = any>(apiFunction: (id: number, data: D) => Promise<T>) {
  return useApi(apiFunction);
}

export function useDelete<T>(apiFunction: (id: number) => Promise<T>) {
  return useApi(apiFunction);
} 