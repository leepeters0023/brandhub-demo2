import { useState, useEffect, useCallback } from "react";

import { filter } from "../utility/utilityFunctions";

export const useInput = (initialValue, secondaryFunc) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
        if (secondaryFunc) {
          secondaryFunc(event.target.value);
        }
      },
    },
  };
};

export const useProgramSort = (programList, sortOption, filters) => {
  const [sortedList, setSortedList] = useState(programList);

  const monthValue = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };
  useEffect(() => {
    if (programList.length === 0) {
      setSortedList([]);
    } else {
      let tempList = filter(programList, filters);
      tempList = tempList.slice();
      tempList.sort((a, b) => {
        return a.brand[0].toLowerCase()[0] < b.brand[0].toLowerCase()[0]
          ? -1
          : a.brand[0].toLowerCase()[0] > b.brand[0].toLowerCase()[0]
          ? 1
          : 0;
      });

      if (sortOption === "brand") {
        setSortedList(tempList);
      } else if (sortOption === "unit") {
        let unitList = [...tempList];
        unitList.sort((a, b) => {
          return a.unit.toLowerCase()[0] < b.unit.toLowerCase()[0]
            ? -1
            : a.unit.toLowerCase()[0] > b.unit.toLowerCase()[0]
            ? 1
            : 0;
        });
        setSortedList(unitList);
      } else if (sortOption === "month") {
        let monthList = [...tempList];
        monthList.sort((a, b) => {
          return monthValue[a.focusMonth] < monthValue[b.focusMonth]
            ? -1
            : monthValue[a.focusMonth] > monthValue[b.focusMonth]
            ? 1
            : 0;
        });
        setSortedList(monthList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, programList, filters]);
  return sortedList;
};

export const useWindowHash = (
  hashArray,
  updateFunc,
  secondaryUpdateFunc = undefined
) => {
  const handleChangeTab = (_evt, newValue) => {
    window.location.hash = hashArray[newValue - 1];
    updateFunc(newValue);
  };

  const handleHash = useCallback(() => {
    if (hashArray.indexOf(window.location.hash) !== -1) {
      updateFunc(hashArray.indexOf(window.location.hash) + 1);
      if (secondaryUpdateFunc !== undefined) {
        let currentHash = window.location.hash;
        let newHash =
          currentHash.slice(1, 3) +
          currentHash.slice(3, 4).toUpperCase() +
          currentHash.slice(4);
        secondaryUpdateFunc(newHash);
      }
    }
  }, [updateFunc, hashArray, secondaryUpdateFunc]);

  useEffect(() => {
    handleHash();
  }, [handleHash]);

  useEffect(() => {
    window.addEventListener("popstate", handleHash);
    return () => window.removeEventListener("popstate", handleHash);
  }, [handleHash]);

  return handleChangeTab;
};

export const useItemUpdate = (items) => {
  const [currentItemValues, updateCurrentItemValues] = useCallback(useState({}));
  
  const handleItemUpdate = useCallback(
    (evt) => {
      const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      let itemValues = { ...currentItemValues };
      let total;
      if (
        numArray.includes(evt.target.value[evt.target.value.length - 1]) ||
        evt.target.value === ""
      ) {
        if (evt.target.value === "") {
          total = 0;
        } else total = parseInt(evt.target.value);
        itemValues[`${evt.target.id}`] = total;
        updateCurrentItemValues(itemValues);
      }
    },
    [currentItemValues, updateCurrentItemValues]
  );

  useEffect(() => {
    if (Object.keys(currentItemValues).length === 0) {
      let itemObj = {};
      items.forEach((item) => {
        itemObj[`${item.id}`] = "";
      });
      updateCurrentItemValues(itemObj);
    }
  }, [items, currentItemValues, updateCurrentItemValues]);

  return {itemValues: currentItemValues, handleItemUpdate}
}
