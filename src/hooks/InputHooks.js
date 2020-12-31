import { useState } from "react";
import { formatMoney } from "../utility/utilityFunctions";
import { useDispatch } from "react-redux";

//Standard input hook for generic input fields
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

//Input hook for money fields, auto formats to $00.00 format on blur
export const useMoneyInput = (initialValue, updateFunc, updateFuncArg, ops) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue);
  const moneyArray = ["$", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
  const strippedValue = (input) => {
    let tempMoneyAr = input.split("$").join("").split(".");
    if (tempMoneyAr[1]) {
      if (ops && tempMoneyAr[1].length >= 4) {
        let newDecValue = tempMoneyAr[1].split("")
        newDecValue.splice(2,0,".")
        newDecValue = newDecValue.join("")
        return `${tempMoneyAr[0]}${newDecValue}`
      }
      if (ops && tempMoneyAr[1].length === 3) {
        let newDecValue = tempMoneyAr[1].split("")
        newDecValue.splice(2,0,".")
        newDecValue = newDecValue.join("")
        return `${tempMoneyAr[0]}${newDecValue}0`
      }
      if (ops && tempMoneyAr[1].length === 2) {
        return tempMoneyAr.join("") + ".00"
      }
      if (ops && tempMoneyAr[1].length === 1) {
        return tempMoneyAr.join("") + "0.00"
      }
      return tempMoneyAr.join("");
    } else return tempMoneyAr[0] + (ops ? "00.00" : "00")
  }
  return {
    value,
    setValue,
    reset: () => setValue(ops ? "$0.0000": "$0.00"),
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
        let newValue = formatMoney(strippedValue(event.target.value), ops)
        setValue(newValue);
        if (updateFunc) {
          let cleanValue = parseFloat(newValue.split("$").join("")).toString();
          dispatch(updateFunc(updateFuncArg, cleanValue))
        }
      }
    },
  };
}

//Input field that only accepts numbers, for use in order tables
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

//Input field that limits total characters, used for order notes
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

//Input field for use with filters, or inputs that require secondary update functions
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