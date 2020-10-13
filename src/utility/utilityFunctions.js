import React from "react";

export const renderChip = (rowData) => {
  if (rowData.status === "Approved") {
    return (
      <div
        style={{
          backgroundColor: "#4caf50",
          color: "#FFF",
          textAlign: "center",
          padding: "1px",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
      </div>
    );
  } else if (rowData.status === "Active") {
    return (
      <div
        style={{
          backgroundColor: "#3f51b5",
          color: "#FFF",
          textAlign: "center",
          padding: "1px",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
      </div>
    );
  } else if (rowData.status === "Pending") {
    return (
      <div
        style={{
          backgroundColor: "#ff9800",
          color: "#FFF",
          textAlign: "center",
          padding: "1px",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
      </div>
    );
  } else if (rowData.status === "Canceled") {
    return (
      <div
        style={{
          backgroundColor: "#f44336",
          color: "#FFF",
          textAlign: "center",
          padding: "1px",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
      </div>
    );
  }
};

export const filter = (array, filters) => {
  let filteredArray = [];
  if (filters.length !== 0) {
    array.forEach((item) => {
      let filtered = true;
      for (let i = 0; i < filters.length; i++) {
        if (!item.brand.includes(filters[i].value)) {
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
