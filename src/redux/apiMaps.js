import { earliestDate } from "../utility/utilityFunctions";
import { brandBULookup, brandLogoMap } from "../utility/constants";
import addDays from "date-fns/addDays";
import { format } from "date-fns";

/*
Functions used to ensure data coming from api always matches
formats defined within the UI
*/
const orderTypeMap = {
  "pre-order": "Pre Order",
  "in-stock": "In Stock",
  "on-demand": "On Demand",
};

const monthMap = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const typeMap = {
  "prior-approval": "Prior Approval",
  price: "Price",
  "item-type": "Item Type",
  material: "Material",
};

export const mapItems = (items) => {
  let mappedItems = items.map((item) => ({
    id: item.id,
    itemNumber: item["item-number"],
    brand: item.brands.map((brand) => brand.name).join(", "),
    program: item.programs
      ? item.programs.map((prog) => prog.name).join(", ")
      : "---",
    itemType: item.type,
    itemDescription: item.description ? item.description : "---",
    estCost: item["estimated-cost"],
    packSize: item["qty-per-pack"],
    stock: Math.floor(Math.random() * 25 + 26),
    imgUrlThumb: item["img-url-thumb"]
      ? item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    imgUrlLg: item["img-url-large"]
      ? item["img-url-large"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
  }));
  return mappedItems;
};

export const mapPublicItems = (items) => {
  let mappedItems = items.map((item) => ({
    id: item.id,
    sequenceNum: item["item-number"],
    brand: item["brand-names"].join(", "),
    program: item["program-names"].join(", "),
    itemType: item["item-type-description"],
    itemDescription: item.description ? item.description : "---",
    inMarketDate: item["in-market-date"] ? item["in-market-date"] : "---",
    imgUrlThumb: item["img-url-thumb"]
      ? item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    imgUrlLg: item["img-url-large"]
      ? item["img-url-large"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
  }));
  return mappedItems;
};

export const mapOrderSetItems = (items) => {
  let mappedItems = items.map((item) => ({
    user: item["user-name"],
    sequenceNum: item["sequence-number"],
    program: item["program-name"],
    itemType: item["item-type-description"],
    itemDescription: item.description ? item.description : "---",
    state: item["state-names"] ? item["state-names"] : "---",
    packSize: item["qty-per-pack"],
    totalItems: item["total-item-qty"],
    estCost: item["estimated-cost"],
    totalEstCost: item["total-estimated-cost"],
    orderDate: item["order-set-submitted-at"],
    orderDue: item["program-order-due-date"]
      ? item["program-order-due-date"]
      : "---",
    status: item["order-set-status"],
    orderSetId: item["order-set"].id,
  }));
  return mappedItems;
};

export const mapPrograms = (programs) => {
  const programArray = programs.map((prog) => ({
    id: prog.id,
    type: prog.type,
    name: prog.name ? prog.name : "---",
    brand:
      prog.brands.length > 0
        ? prog.brands.map((brand) => brand.name)
        : ["BRAND"],
    unit: prog.brands.length > 0 ? brandBULookup[prog.brands[0].name] : "UNIT",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
    goals: prog.goals,
    strategies: prog.strategies,
    startDate: prog["start-date"],
    endDate: prog["end-date"],
    focusMonth: monthMap[prog["start-date"].split("-")[1]],
    imgUrl:
      prog.brands.length === 1
        ? brandLogoMap[prog.brands[0].name]
        : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607526835/Select/multi-brand_e7vgai.png",
    items: [],
    status: false,
  }));
  programArray.sort((a, b) => {
    return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
      ? -1
      : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
      ? 1
      : 0;
  });
  return programArray;
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
    program:
      order["program-names"] && order["program-names"].length > 0
        ? order["program-names"].join(", ")
        : "---",
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

export const mapOrderHistoryItems = (items) => {
  let mappedItems = items.map((item) => ({
    sequenceNum: item["item-number"],
    imgUrlThumb: item.item["img-url-thumb"]
      ? item.item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    imgUrlLg: item.item["img-url-large"]
      ? item.item["img-url-large"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    orderType: item.item["order-type"],
    brand: item.item.brands.map((brand) => brand.name),
    program: item["program-names"].join(", "),
    itemType: item["item-type-description"],
    itemDescription: item.description ? item.description : "---",
    distributor: item["distributor-name"],
    state: item.state ? item.state : "---",
    packSize: item["qty-per-pack"],
    totalItems: item.qty,
    estCost: item["estimated-cost"],
    totalEstCost: item["total-estimated-cost"],
    actCost: item["actual-cost"] ? item["actual-cost"] : "---",
    totalActCost: item["total-actual-cost"] ? item["total-actual-cost"] : "---",
    orderDate: item["order-submitted-at"],
    shipDate: item["order-shipped-at"] ? item["order-shipped-at"] : "---",
    tracking: item["tracking-number"] ? item["tracking-number"] : "---",
    status: item["order-status"],
    orderId: item.order.id,
  }));
  return mappedItems;
};

export const mapOrderItems = (items, type) => {
  let mappedItems = items
    .map((item) => ({
      id: item.id,
      itemId: item.item.id,
      itemNumber: item.item["item-number"],
      imgUrlThumb: item.item["img-url-thumb"]
        ? item.item["img-url-thumb"]
        : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      imgUrlLg: item.item["img-url-large"]
        ? item.item["img-url-large"]
        : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      brand: item.item.brands.map((brand) => brand.name).join(", "),
      itemType: item.item.type,
      itemDescription: item.item.description ? item.item.description : "---",
      packSize: item.item["qty-per-pack"],
      estCost: item.item["estimated-cost"],
      totalItems: type === "order-set-item" ? 0 : item.qty,
      totalEstCost:
        type === "order-set-item" ? 0 : item["total-estimated-cost"],
      actTotal: "---",
      complianceStatus: item.item["compliance-status"]
        ? item.item["compliance-status"]
        : "compliant",
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
      return i["order-program"];
    } else {
      if (i.programs && i.programs.length > 1) {
        return earliestDate(i.programs)[0];
      } else if (i.programs.length === 1) {
        return i.programs[0];
      } else {
        return "---";
      }
    }
  };
  let mappedItems = items.map((item) => ({
    id: item.id,
    itemId: item.item.id,
    sequenceNum: item["item-number"],
    projectNum: item["project-number"] ? item["project-number"] : "---",
    territory:
      item["territory-name"].length === 0 ? "National" : item["territory-name"],
    brand: item.brands
      ? item.brands.map((brand) => brand.name).join(", ")
      : item.programs
          .map((prog) => prog.brands.map((brand) => brand.name))
          .join(", "),
    program: determineProgram(item),
    programs: item.programs,
    itemType: item["item-type-description"],
    itemDescription: item.description ? item.description : "---",
    totalItems: item["total-ordered"],
    orderItemIds: item["order-item-ids"],
    totalNotCompliant: item["not-compliant-count"],
    supplier: item["supplier-name"] ? item["supplier-name"] : null,
    estCost: item["estimated-cost"],
    totalEstCost: item["estimated-total"],
    dueDate: item["order-due-date"] ? item["order-due-date"] : "---",
  }));

  return mappedItems;
};

export const mapPOItems = (items) => {
  const mappedItems = items.map((item) => ({
    id: item.id,
    itemId: item.item.id,
    sequenceNum: item["item-number"],
    program: item["program-names"].length > 0 ? item["program-names"] : "---",
    itemType: item["item-type-description"],
    packSize: item["actual-qty-per-pack"],
    itemSpec: {
      "Back 4-Color": item["item-specification"]["Back 4-Color"],
      "Back Finish": item["item-specification"]["Back Finish"],
      "Die/Job Number": item["item-specification"]["Die/Job Number"],
      Dieline: item["item-specification"]["Dieline"],
      Embossing: item["item-specification"]["Embossing"],
      "Flat Size": item["item-specification"]["Flat Size"],
      "Front 4-Color": item["item-specification"]["Front 4-Color"],
      "Front Finish": item["item-specification"]["Front Finish"],
      "Hot Stamp": item["item-specification"]["Hot Stamp"],
      "Pack Out": item["item-specification"]["Pack Out"],
      Perf: item["item-specification"]["Perf"],
      Score: item["item-specification"]["Score"],
      Stock: item["item-specification"]["Stock"],
      "Supplier Instructions":
        item["item-specification"]["Supplier Instructions"],
    },
    totalItems: item.qty,
    estCost: item["item-estimated-cost"],
    actCost: item["actual-cost"],
    totalCost: item["actual-cost"] * item.qty,
    packOut: item["has-packout"] ? item["has-packout"] : false,
  }));
  return mappedItems;
};

export const mapPOShippingParamItems = (items) => {
  const mappedItems = items.map((item) => ({
    id: item.id,
    sequenceNum: item["item-number"] ? item["item-number"] : "---",
    itemType: item["item-type-description"]
      ? item["item-type-description"]
      : "---",
    totalItems: item.qty,
    shipStatus: item["shipping-status"] ? item["shipping-status"] : "---",
    tracking: item.tracking ? item.tracking : "---",
    tax: item.tax ? item.tax : "---",
  }));
  return mappedItems;
};

export const mapPOShippingParams = (params) => {
  const formatAddress = (shipObj) => {
    let addOne = shipObj["street-address-1"];
    let addTwo = shipObj["street-address-2"]
      ? shipObj["street-address-2"]
      : false;
    let city = shipObj.city;
    let state = shipObj.state;
    let country = shipObj.country;
    let zip = shipObj.zip;
    return [addOne, addTwo, city, state, zip, country]
      .filter((address) => address)
      .join(", ");
  };
  const mappedParams = params.map((param) => ({
    id: param.id,
    distributor: param.distributor ? param.distributor.name : "---",
    attn: param.attn ? param.attn : "---",
    address: formatAddress(param),
    addressOne: param["street-address-1"],
    addressTwo: param["street-address-2"] ? param["street-address-2"] : "---",
    city: param.city,
    state: param.state,
    zip: param.zip,
    country: param.country,
    carrier: param.carrier ? param.carrier : "---",
    method: param.method ? param.method : "---",
    actualShip: param["actual-ship-date"] ? param["actual-ship-date"] : "---",
    items: mapPOShippingParamItems(param["shipping-parameter-items"]),
  }));
  return mappedParams;
};

export const mapPurchaseOrder = (purchaseOrder) => {
  const formattedPO = {
    id: purchaseOrder.id,
    status: purchaseOrder.status,
    accepted: false,
    dueDate: purchaseOrder["in-market-date"]
      ? purchaseOrder["in-market-date"]
      : addDays(new Date(), 120),
    expectedShip: purchaseOrder["expected-ship-date"]
      ? purchaseOrder["expected-ship-date"]
      : addDays(new Date(), 90),
    terms: purchaseOrder.terms ? purchaseOrder.terms : "Net 30 Days",
    supplier: purchaseOrder.supplier.name,
    contactName: purchaseOrder.supplier.contact
      ? purchaseOrder.supplier.contact
      : "---",
    email: purchaseOrder.supplier.email ? purchaseOrder.supplier.email : "---",
    phone: purchaseOrder.supplier.phone ? purchaseOrder.supplier.phone : "---",
    purchasedBy: purchaseOrder.purchaser.name,
    supplierNotes: purchaseOrder.note ? purchaseOrder.note : "",
    keyAcctTape: purchaseOrder["key-account-tape"]
      ? purchaseOrder["key-account-tape"]
      : "",
    shippingLabel: purchaseOrder.label ? purchaseOrder.label : "---",
    rfqNumber: purchaseOrder["rfq-number"]
      ? purchaseOrder["rfq-number"]
      : "---",
    poItems: mapPOItems(purchaseOrder["purchase-order-items"]),
    additionalCosts: purchaseOrder["extra-costs"]
      ? purchaseOrder["extra-costs"]
      : [],
    totalCost: mapPOItems(purchaseOrder["purchase-order-items"])
      .map((item) => item.totalCost)
      .reduce((a, b) => a + b),
    directShip: purchaseOrder["is-direct-ship"],
    shippingParams: mapPOShippingParams(purchaseOrder["shipping-parameters"]),
  };
  return formattedPO;
};

export const mapPOHistoryItems = (items) => {
  const mappedItems = items.map((item) => ({
    id: item.id,
    itemId: item.item.id,
    poNum: item["purchase-order"].id,
    sequenceNum: item["item-number"],
    projectNum: item["project-number"] ? item["project-number"] : "---",
    supplier: item["supplier-name"] ? item["supplier-name"] : "---",
    itemType: item["item-type-description"],
    itemDesc: item["item-description"] ? item["item-description"] : "---",
    brand: item["brand-names"],
    program: item["program-names"],
    totalItems: item.qty,
    estCost: item["item-estimated-cost"],
    actCost: item["actual-cost"],
    status: item["po-status"],
    dueDate: item["po-in-market-date"] ? item["po-in-market-date"] : "---",
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
    inMarketDate: rfq["in-market-date"] ? rfq["in-market-date"] : "---",
    bids: mapBids(rfq.bids),
    program: rfq.program.name,
    brand: rfq.item.brands.map((brand) => brand.name).join(", "),
    itemType: rfq.item.type,
    itemDescription: rfq.item.description ? rfq.item.description : "---",
    sequenceNum: rfq.item["item-number"],
    totalItems: rfq.qty,
    estCost: rfq.item["estimated-cost"],
    totalEstCost: rfq.qty * rfq.item["estimated-cost"],
    supplierNote: rfq.note ? rfq.note : "",
    //TODO not sure about this line, as we don't know what the spec will look like yet
    itemSpec: rfq.item.spec ? rfq.item.spec : null,
    //TODO currently just getting the one image, need to update when we get more
    imgUrlThumbOne: rfq.item["img-url-thumb"]
      ? rfq.item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    imgUrlThumbTwo: rfq.item["img-url-thumb"]
      ? rfq.item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
    imgUrlThumbThree: rfq.item["img-url-thumb"]
      ? rfq.item["img-url-thumb"]
      : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
  };

  return mappedRFQ;
};

export const mapRFQHistory = (rfqs) => {
  let mappedRFQHistory = rfqs.map((rfq) => mapRFQ(rfq));
  return mappedRFQHistory;
};

export const mapRules = (rules) => {
  let mappedRules = rules.map((rule) => ({
    id: rule.id,
    ruleType: typeMap[rule.type],
    desc: rule.description,
    itemTypeCode: rule["item-type-category-code"]
      ? rule["item-type-category-code"]
      : "---",
    itemTypes:
      rule["item-type-descriptions"].length > 0
        ? rule["item-type-descriptions"].join(", ")
        : "---",
    price: rule.price ? rule.price : "---",
    productFamilies:
      rule["product-family-names"].length > 0
        ? rule["product-family-names"].join(", ")
        : "---",
    states: rule["state-codes"].join(", "),
  }));
  return mappedRules;
};

export const mapCompItems = (items) => {
  const statusMap = {
    "prior-approval-pending": "Pending",
    "in-violation": "Denied",
    approved: "Approved",
  };
  let mappedItems = items.map((item) => ({
    id: item.id,
    sequenceNum: item["item-number"],
    program: item["most-recent-program-name"],
    itemType: item["item-type-description"],
    ruleType: typeMap[item.rule.type],
    ruleDesc: item.rule.description,
    status: statusMap[item.status],
    //These two are placeholder for now
    active: true,
    emailSent:
      item.rule.type === "prior-approval"
        ? format(new Date(), "MM/dd/yyyy")
        : "---",
  }));
  return mappedItems;
};
