import { useState } from "react";
import { formatMoney } from "../utility/utilityFunctions";

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

export const useMoneyInput = (initialValue, _updateFunc) => {
  const [value, setValue] = useState(initialValue);
  const moneyArray = ["$", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
  const strippedValue = (input) => {
    return input.split("$").join("").split(".").join("")
  }
  //TODO handle update func call
  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        if (
          moneyArray.includes(
            event.target.value[event.target.value.length - 1]
          ) ||
          event.target.value === ""
        ) {
          if (event.target.value === "") {
            setValue("");
          } else setValue(event.target.value);
        }
      },
      onBlur: (event) => {
        let newValue = formatMoney(strippedValue(event.target.value))
        setValue(newValue);
      }
    },
  };
}

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