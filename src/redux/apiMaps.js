const orderTypeMap = {
  "pre-order": "Pre Order",
  "in-stock": "In Stock",
  "on-demand": "On Demand",
};

export const mapSingleOrder = (order) => {
  let formattedOrder = {
    id: order.id,
    distributorId: order.distributor.id,
    distributorName: order.distributor.name,
    distributorCity: order.distributor.city,
    distributorState: order.distributor.state,
    distributorCountry: order.distributor.country,
    distributorAddressOne: order.distributor["street-address-1"],
    distributorAddressTwo: order.distributor["street-address-2"],
    distributorZip: order.distributor.zip,
    program: order.program ? order.program : "---",
    type: orderTypeMap[order.type],
    status: order.status === "submitted" ? "Pending" : order.status,
    orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
    approvedDate: order["approved-at"] ? order["approved-at"] : "---",
    shipDate: order["shipped-at"] ? order["shipped-at"] : "---",
    trackingNum: order["tracking-number"] ? order["tracking-number"] : "---",
    totalItems: order["total-quantity"],
    totalEstCost: order["total-estimated-cost"],
    totalActCost: "---",
    note: order.notes ? order.notes : "---",
    attn: order.attn ? order.attn : "---",
  };
  return formattedOrder;
};

export const mapOrderHistoryOrders = (orders) => {
  let mappedOrders = orders.map((order) => {
    let formattedOrder = mapSingleOrder(order);
    return formattedOrder;
  });
  console.log(mappedOrders);
  return mappedOrders;
};

export const mapOrderItems = (items) => {
  let mappedItems = items.map((item) => ({
    id: item.id,
    itemId: item.item.id,
    itemNumber: item.item["item-number"],
    imgUrl: item.item["img-url"],
    brand: item.item.brands.map((brand) => brand.name).join(", "),
    itemType: item.item.type,
    packSize: item.item["qty-per-pack"],
    estCost: item.item["estimated-cost"],
    totalItems: item.qty,
    estTotal: item["total-estimated-cost"],
    actTotal: "---",
    complianceStatus: item.item["compliance-status"],
    tracking: item.tracking ? item.tracking : "---",
  }));
  return mappedItems;
};
