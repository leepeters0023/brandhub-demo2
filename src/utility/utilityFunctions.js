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

//TODO make work for items!

export const filter = (array, filters) => {
  let filteredArray = [];
  if (filters.length !== 0) {
    filters.forEach((filter) => {
      array
        .filter((item) => {
          if (filter.type !== "brand") {
            return item[filter.type] === filter.value
          } else {
            return item.brand.includes(filter.value)
          }
        })
        .forEach((item) => {
          if (filteredArray.filter((i) => i.id === item.id).length === 0) {
            filteredArray.push(item);
          }
        });
    });
    return filteredArray;
  } else return array;
};
