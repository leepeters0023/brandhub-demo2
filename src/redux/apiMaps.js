import { earliestDate } from "../utility/utilityFunctions";

/*
Functions used to ensure data coming from api always matches
formats defined within the UI
*/
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

export const mapRollupItems = (items) => {
  const determineProgram = (i) => {
    if (i["order-program"]) {
      return [i["order-program"]];
    } else {
      if (i.programs && i.programs.length > 1) {
        return earliestDate(i.programs)[0];
      } else if (i.programs) {
        return i.programs[0];
      } else {
        return "---";
      }
    }
  };
  console.log(items);
  let mappedItems = items.map((item) => ({
    id: item.item.id,
    itemId: item.item.id,
    sequenceNum: item["item-number"],
    territory:
      item["territory-name"].length === 0 ? "National" : item["territory-name"],
    program: determineProgram(item),
    programs: item.programs,
    itemType: item["item-type-description"],
    totalItems: item["total-ordered"],
    totalNotCompliant: item["not-compliant-count"],
    supplier: item["supplier-name"] ? item["supplier-name"] : null,
    estCost: item["estimated-cost"],
    totalEstCost: item["estimated-total"],
    dueDate: item["order-due-date"] ? item["order-due-date"] : "---",
  }));

  return mappedItems;
};

export const mapRFQ = (rfq) => {
  const mapBids = (bids) => {
    return bids.map((bid) => ({
      id: bid.id,
      supplierId: bid.supplier ? bid.supplier.id : bid.id,
      note: bid.note,
      price: bid.price,
    }));
  };

  let mappedRFQ = {
    id: rfq.id,
    status: rfq.status ? rfq.status : "Pending",
    dueDate: rfq["due-date"] ? rfq["due-date"] : "---",
    inMarketDate: rfq["end-market-date"] ? rfq["end-market-date"] : "---",
    bids: mapBids(rfq.bids),
    program: rfq.program.name,
    brand: rfq.item.brands.map((brand) => brand.name).join(", "),
    itemType: rfq.item.type,
    sequenceNum: rfq.item["item-number"],
    totalItems: rfq.qty,
    estCost: rfq.item["estimated-cost"],
    totalEstCost: rfq.qty * rfq.item["estimated-cost"],
    supplierNote: rfq.note ? rfq.note : "",
    //TODO not sure about this line, as we don't know what the spec will look like yet
    itemSpec: rfq.item.spec ? rfq.item.spec : null,
    //TODO currently just getting the one image, need to update when we get more
    imgUrlOne: rfq.item["img-url"],
    imgUrlTwo: rfq.item["img-url"],
    imgUrlThree: rfq.item["img-url"],
  };

  return mappedRFQ;
};

export const mapRFQHistory = (rfqs) => {
  let mappedRFQHistory = rfqs.map((rfq) => mapRFQ(rfq));
  return mappedRFQHistory;
};
