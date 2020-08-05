import { useState, useEffect } from "react";

import { filter } from "../utility/utilityFunctions";

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
    let tempList = filter(programList, filters)
    tempList.sort((a, b) => {
      return a.brand.toLowerCase()[0] < b.brand.toLowerCase()[0]
      ? -1
      : a.brand.toLowerCase()[0] > b.brand.toLowerCase()[0]
      ? 1
      : 0;
    });
    
    if (sortOption === "brand") {
      setSortedList(tempList)
    } else if (sortOption === "unit") {
      let unitList = [...tempList]
      unitList.sort((a,b) => {
        return a.unit.toLowerCase()[0] < b.unit.toLowerCase()[0]
        ? -1
        : a.unit.toLowerCase()[0] > b.unit.toLowerCase()[0]
        ? 1
        : 0;
      });
      setSortedList(unitList)
    } else if (sortOption === "month") {
      let monthList = [...tempList]
      monthList.sort((a,b) => {
        return monthValue[a.focusMonth] < monthValue[b.focusMonth]
        ? -1
        : monthValue[a.focusMonth] > monthValue[b.focusMonth]
        ? 1
        : 0;
      })
      setSortedList(monthList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, programList, filters])
  return sortedList;
};
