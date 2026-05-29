import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `value` has stopped
 * changing for `delayMs`. Used on the search box so typing doesn't fire an API call
 * (and thus a new query key) on every keystroke — only after a pause.
 *
 * How it works: each render schedules a timer to copy the latest value; if the value
 * changes again before the timer fires, the cleanup cancels the old timer and a new
 * one is scheduled. The debounced value lands only once typing settles.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
