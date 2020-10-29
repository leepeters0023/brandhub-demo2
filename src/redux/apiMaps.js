import { earliestDate } from "../utility/utilityFunctions";

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
    program: order.program ? order.program.name : "---",
    type: orderTypeMap[order.type],
    items: mapOrderItems(order["order-items"], "history"),
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
  return mappedOrders;
};

export const mapOrderItems = (items, type) => {
  let mappedItems = items
    .map((item) => ({
      id: item.id,
      itemId: item.item.id,
      itemNumber: item.item["item-number"],
      imgUrl: item.item["img-url"],
      brand: item.item.brands.map((brand) => brand.name).join(", "),
      itemType: item.item.type,
      packSize: item.item["qty-per-pack"],
      estCost: item.item["estimated-cost"],
      totalItems: type === "order-set-item" ? 0 : item.qty,
      totalEstCost:
        type === "order-set-item" ? 0 : item["total-estimated-cost"],
      actTotal: "---",
      complianceStatus: item.item["compliance-status"],
      tracking: item.tracking ? item.tracking : "---",
    }))
    .sort((a, b) => {
      return parseInt(a.itemNumber) < parseInt(b.itemNumber)
        ? -1
        : parseInt(a.itemNumber) > parseInt(b.itemNumber)
        ? 1
        : 0;
    });
  return mappedItems;
};

export const mapOrderSet = (order) => {
  let formattedOrder = {
    id: order.id,
    userId: order.user.id,
    userName: order.user.name,
    orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
    approvedDate: order["approved-at"] ? order["approved-at"] : "---",
    dueDate: order["due-date"] ? order["due-date"] : "---",
    type: orderTypeMap[order.type],
    program: order.program ? order.program.name : "---",
    territories: order["territory-names"] ? order["territory-names"] : "---",
    state: order["random-order-state"] ? order["random-order-state"] : "---",
    status: order.status,
    orderCount: order["order-count"],
    totalItems: order["total-quantity"],
    totalEstCost: order["total-estimated-cost"],
    totalActCost: order["total-actual-cost"]
      ? order["total-actual-cost"]
      : "---",
    budget: order.budget ? order.budget : "$25,000.00",
  };
  return formattedOrder;
};

export const mapOrderSetHistory = (orders) => {
  let mappedOrders = orders.map((order) => {
    let formattedOrder = mapOrderSet(order);
    return formattedOrder;
  });
  return mappedOrders;
};

export const mapRFQItems = (items) => {

  const determineProgram = (i) => {
    if (i["order-program"]) {
      return i["order-program"].name
    } else {
      if (i.program && i.program.length > 1) {
        return earliestDate(i.program).name
      } else if (i.program) {
        return i.program[0].name
      } else {
        return "---"
      }
    }
  }

  let mappedItems = items.map((item) => ({
    id: item.item.id,
    itemId: item.item.id,
    sequenceNum: item["item-number"],
    territory: item["territory-name"],
    program: determineProgram(item),
    itemType: item["item-type-description"],
    totalItems: item["total-ordered"],
    totalNotCompliant: item["not-compliant-count"],
    estCost: item["estimated-cost"],
    totalEstCost: item["estimated-total"],
    dueDate: item["order-due-date"] ? item["order-due-date"] : "---",
  }));

  return mappedItems;
};
