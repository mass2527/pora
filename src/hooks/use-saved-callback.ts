import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line unused-imports/no-unused-vars
export function useSavedCallback<T extends (...args: any[]) => any>(
  callback: T
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const savedCallback = useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;

  return savedCallback;
}
