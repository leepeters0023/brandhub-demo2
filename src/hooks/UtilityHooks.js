import { useState, useEffect, useCallback } from "react";

import { filter } from "../utility/utilityFunctions";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setClear,
  setRetain,
  setFetchCurrent,
} from "../redux/slices/filterSlice";

/*
Manages sorting and filtering of programs in the Pre Order Program view
This is the only view where sorting is handled in the UI
*/
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
  }, [sortOption, programList, filters, filters.length]);
  return sortedList;
};

/*
For views using tabs, manages history and makes sure that browser functions
are recognized by the ui where there are tabs that render different views
*/
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

/*
Handles setting initial filters for views with filters, and retaining those
filters if retainFilters is truthy in state
*/
export const useInitialFilters = (
  filterType,
  defaultFilters,
  retainFilters,
  dispatch,
  handleFilterDrawer,
  currentUserRole
) => {
  useEffect(() => {
    dispatch(setFilterType({ type: filterType }));
    if (!retainFilters) {
      dispatch(
        setDefaultFilters({
          filterObject: defaultFilters,
        })
      );
      dispatch(
        updateMultipleFilters({
          filterObject: defaultFilters,
        })
      );
    }
    handleFilterDrawer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserRole.length > 0 && !retainFilters) {
      dispatch(setClear());
    } else {
      dispatch(setRetain({ value: false }));
      dispatch(setFetchCurrent());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/*
For views that filtered views can 
*/
export const useRetainFiltersOnPopstate = (origin, dispatch) => {
  const handleRetain = (event) => {
    if (!origin) return null;
    if (event.target.location.pathname.includes(origin)) {
      dispatch(setRetain({ value: true }));
    }
  };
  useEffect(() => {
    window.addEventListener("popstate", handleRetain);
    return () => window.removeEventListener("popstate", handleRetain);
  });
};
