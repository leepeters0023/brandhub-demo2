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
    filters.forEach((filter) => {
      array
        .filter((item) => item[filter.type] === filter.value)
        .forEach((item) => {
          if (filteredArray.filter((i) => i.id === item.id).length === 0) {
            filteredArray.push(item);
          }
        });
    });
    return filteredArray;
  } else return array;
};

export const mapNewOrdersToProgram = (program, distributors, items) => {
  const newOrders = [];
  distributors.forEach((dist) => {
      let order = {
        distributorId: dist.id,
        distributorName: dist.name,
        type: "program",
        program: {id: program.id, name: program.name},
        items: [],
        budget: undefined,
        totalItems: 0,
        totalEstCost: 0,
      };
      newOrders.push(order)
  });
  for (let item in items) {
    for (let dist in items[item].distributors) {
      let currentOrder = newOrders.find(o => o.distributorName === dist)
      let currentItem = {
        itemNumber: item,
        brand: items[item].itemDetails.brand,
        itemType: items[item].itemDetails.itemType,
        price: items[item].itemDetails.price,
        qty: items[item].itemDetails.qty,
        imgUrl: items[item].itemDetails.imgUrl,
        complianceStatus: items[item].itemDetails.complianceStatus,
        totalItems: parseInt(items[item].distributors[dist]),
        estTotal: (parseInt(items[item].distributors[dist]) * items[item].itemDetails.price).toFixed(2)
      }
      let editOrder = {...currentOrder}
      editOrder.items.push(currentItem)
      editOrder.totalItems += currentItem.totalItems
      editOrder.totalEstCost += parseFloat(currentItem.estTotal)
      newOrders.splice(newOrders.indexOf(currentOrder), 1, editOrder)
    }
  }
  newOrders.forEach(order => order.totalEstCost = parseFloat(order.totalEstCost.toFixed(2)))
  return newOrders;
};
