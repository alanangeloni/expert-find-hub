
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { persistence } from './persistence';

/**
 * React state that survives reloads through the async persistentStorage bridge.
 * Writes are debounced so dragging a slider doesn't hammer the host.
 */
export function usePersistentState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initial);
  const ready = useRef(false);

  useEffect(() => {
    let alive = true;
    persistence.getItem(key).then((raw) => {
      if (!alive) return;
      if (raw != null) {
        try {
          const parsed = JSON.parse(raw) as T;
          setState((prev) =>
            parsed && typeof parsed === 'object' && !Array.isArray(parsed)
              ? { ...(prev as object), ...(parsed as object) } as T
              : parsed
          );
        } catch {
          /* keep the default */
        }
      }
      ready.current = true;
    });
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (!ready.current) return;
    const timer = window.setTimeout(() => {
      persistence.setItem(key, JSON.stringify(state));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [key, state]);

  return [state, setState];
}
