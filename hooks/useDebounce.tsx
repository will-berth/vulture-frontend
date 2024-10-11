import { useEffect, useRef, useState } from "react";

const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return [debouncedValue];
};

export default useDebounce;
