import React, { useState, useEffect, useRef, useCallback } from "react";

interface DebounceOptions<T = any> {
  onChange?: (value: T) => void;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

const defaultOptions: DebounceOptions = {
  onChange: () => {},
  leading: false,
  trailing: true,
};

function useDebounce<T>(value: T, delay: number, options: DebounceOptions<T> = {}): [T] {
  const leadingCall = useRef(false);
  const handler = useRef<NodeJS.Timeout | null>(null);
  const waitHandler = useRef<NodeJS.Timeout | null>(null);
  const componentMounted = useRef<boolean | null>(null);
  const optionsRef = useRef<DebounceOptions<T> | null>(null);

  const [debouncedValue, setDebouncedValue] = useState(value);

  // Use options from argument when available, else fall back to default options
  options = Object.assign({}, defaultOptions, options);

  const clearHandler = useCallback(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = null;
    if (waitHandler.current) clearTimeout(waitHandler.current);
    waitHandler.current = null;
    leadingCall.current = false;
  }, []);

  // Updating the options on every render, room for improvement
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    componentMounted.current = true;
    return () => {
      // on component unmount
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (optionsRef.current?.onChange) optionsRef.current.onChange(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    if (leadingCall.current) {
      leadingCall.current = false;
    }

    if (!handler.current && options.leading && !leadingCall.current) {
      setDebouncedValue(value);
      leadingCall.current = true;
    }

    handler.current = setTimeout(() => {
      let shouldCallFunction = true;
      if (options.leading && leadingCall.current) {
        shouldCallFunction = false;
      }

      clearHandler();

      if (componentMounted.current && options.trailing && shouldCallFunction) {
        setDebouncedValue(value);
      }
    }, delay);

    if (options.maxWait && !waitHandler.current && options.trailing) {
      waitHandler.current = setTimeout(() => {
        clearHandler();

        if (componentMounted.current) {
          setDebouncedValue(value);
        }
      }, options.maxWait);
    }
  }, [delay, clearHandler, options.leading, options.trailing, options.maxWait, value]);

  return [debouncedValue];
}

function useDebounceState<T>(
  initialValue: T,
  delay: number,
  options: DebounceOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(value, delay, options);

  return [value, setValue, debouncedValue];
}

export { useDebounce, useDebounceState };
