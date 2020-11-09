import isBefore from "date-fns/isBefore";

//Handles filtering of programs for the Pre Order Program View
export const filter = (array, filters) => {
  let filteredArray = [];
  if (filters.length !== 0) {
    array.forEach((item) => {
      let filtered = true;
      for (let i = 0; i < filters.length; i++) {
        if (
          filters[i].type === "brand" &&
          !item.brand.includes(filters[i].value)
        ) {
          filtered = false;
          break;
        }
        if (
          item[filters[i].type] !== filters[i].value &&
          filters[i].type !== "brand"
        ) {
          filtered = false;
          break;
        }
      }
      if (filtered) {
        filteredArray.push(item);
      }
    });
    return filteredArray;
  } else return array;
};

export const earliestDate = (dateArray) => {
  let sortedDates = dateArray.sort((a, b) => {
    return isBefore(new Date(a["start-date"]), new Date(b["start-date"]))
      ? -1
      : !isBefore(new Date(a["start-date"]), new Date(b["start-date"]))
      ? 1
      : 0;
  })
  return sortedDates;
}

/*
Formats integers into $00.00 format for display purposes, all incoming data
representing money from the api is in cents
*/
export const formatMoney = (value) => {
  let moneyAr = (value / 100).toFixed(2).split(".");
  if (moneyAr[0].length > 3) {
    let preDecimalAr = moneyAr[0].split("").reverse();
    let formattedPreDec = preDecimalAr
      .map((num, i) =>
        (i + 1) % 3 === 0 && i + 1 !== preDecimalAr.length ? "," + num : num
      )
      .reverse()
      .join("");
    let returnString = "$" + formattedPreDec + "." + moneyAr[1];
    return returnString;
  } else {
    return "$" + moneyAr[0] + "." + moneyAr[1];
  }
};

//Used in order tables to ensure order numbers match pack size
export const roundUp = (value, rounder) => {
  if (rounder === 1) {
    return value
  }
  if (value % rounder === 0) {
    return value;
  }
  let multiplier = Math.floor(value / rounder);
  if (multiplier === 0) {
    return rounder;
  }
  let roundedUp = multiplier * rounder + rounder;
  return roundedUp;
};

//Used for filtering purposes, just a quick call to modify an array
export const separateByComma = (array, key) => {
  if (key) {
    return array.map((index) => index[key]).join(",");
  } else {
    return array.join(",");
  }
};
