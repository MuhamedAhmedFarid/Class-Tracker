import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value.
 * The debounced value only updates after the input value has stopped changing
 * for the specified delay time.
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds to wait before updating the debounced value.
 * @returns {any} The debounced value.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timer if the value changes (user keeps typing)
    // or if the component unmounts.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}