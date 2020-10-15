export const filter = (array, filters) => {
  let filteredArray = [];
  if (filters.length !== 0) {
    array.forEach((item) => {
      let filtered = true;
      for (let i = 0; i < filters.length; i++) {
        if (
          (filters[i].type === "brand" &&
            !item.brand.includes(filters[i].value)) ||
          item[filters[i].type] !== filters[i].value
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

export const roundUp = (value, rounder) => {
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

export const separateByComma = (array, key) => {
  if (key) {
    return array.map((index) => index[key]).join(",");
  } else {
    return array.join(",");
  }
}
