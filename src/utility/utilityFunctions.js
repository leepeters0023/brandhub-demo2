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
    array.forEach(item => {
      let filtered = true
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].type !== "brand") {
          if (item[filters[i].type] !== filters[i].value) {
            filtered = false
            break
          }
        } else if (!item.brand.includes(filters[i].value)) {
          filtered = false
          break
        }
      }
      if (filtered) {
        filteredArray.push(item)
      }
    })
    return filteredArray
  } else return array;
};

export const formatMoney = (value) => {
  return `$${(value/100).toFixed(2)}`
}
