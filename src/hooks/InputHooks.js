import { useState } from "react";

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  };
};

export const useNumberOnlyInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        if (
          numArray.includes(
            event.target.value[event.target.value.length - 1]
          ) ||
          event.target.value === ""
        ) {
          if (event.target.value === "") {
            setValue(0);
          } else setValue(parseInt(event.target.value));
        }
        setValue(event.target.value);
      },
    },
  };
};

export const useLimitedInput = (initialValue, max) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        if (event.target.value.length <= max) {
          setValue(event.target.value);
        }
      },
    },
  };
};

export const useDetailedInput = (
  initialValue,
  secondaryFunc,
  type,
  filterType
) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
        secondaryFunc(event.target.value, type, filterType);
      },
    },
  };
};