import { separateByComma } from "../utility/utilityFunctions";

/*
Builds the string of filters used when querying the api, currently not
tied into everything as we are still updating filters for a lot of the
routes, but eventually will be tied in to all queries with filters
*/
//TODO add missing filters when they work correctly (BU currently is it I think?)
const statusMap = {
  "order-set-items": "order-set-status",
  "history-items": "order-status",
};

const dateMap = {
  "order-set-items": "order-set-submitted-at-range",
  "history-items": "order-submitted-at-range",
};

export const buildFilters = (
  filterObject,
  uniqueFilter,
  sortString,
  urlBase,
  type
) => {
  console.log(type)
  let statusString =
    filterObject.status && filterObject.status.length > 0
      ? filterObject.status === "all"
        ? ""
        : filterObject.status.includes("bid-")
        ? `${
            filterObject.status === "bid-awarded"
              ? `filter[bid-status]=${
                  filterObject.status.split("-")[1]
                }&filter[status]=awarded`
              : `filter[bid-status]=${filterObject.status.split("-")[1]}`
          }`
        : `filter[${
            type === "order-set-items" || type === "history-items"
              ? statusMap[type]
              : "status"
          }]=${
            type === "po-history" && filterObject.status === "shipping-hold"
              ? "in-progress"
              : filterObject.status
          }`
      : "";
  let shipHoldString =
    type === "po-history" &&
    filterObject.status === "shipping-hold" &&
    filterObject.hasShipHold
      ? "filter[has-ship-hold]=true"
      : type === "po-history" && filterObject.status === "in-progress"
      ? "filter[has-ship-hold]=false"
      : "";
  let typeString = filterObject.type ? `filter[type]=${filterObject.type}` : "";
  let orderTypeString =
    type && type === "item" && filterObject.orderType
      ? filterObject.orderType === "in-stock"
        ? "filter[is-in-stock]=true"
        : "filter[is-on-demand]=true"
      : type && type === "rollup" && filterObject.orderType
      ? filterObject.orderType === "on-demand"
        ? "filter[order-set-type]=on-demand"
        : "filter[order-set-type]=pre-order"
      : filterObject.orderType
      ? `filter[order-type]=${filterObject.orderType}`
      : "";
  let dateString =
    filterObject.fromDate &&
    filterObject.toDate &&
    (type === "order-set-history" || type === "order-set-items") &&
    filterObject.status === "submitted"
      ? `filter[submitted-at-range]=${filterObject.fromDate} - ${filterObject.toDate}`
      : filterObject.fromDate &&
        filterObject.toDate &&
        (type === "order-set-history" || type === "order-set-items") &&
        filterObject.status !== "submitted"
      ? ""
      : filterObject.fromDate && filterObject.toDate
      ? `filter[${
          type === "order-set-items" || type === "history-items"
            ? dateMap[type]
            : "submitted-at-range"
        }]=${filterObject.fromDate} - ${filterObject.toDate}`
      : "";
  let seqString =
    filterObject.itemNumber && filterObject.itemNumber.length > 0
      ? `filter[item-number]=${filterObject.itemNumber}`
      : "";
  let rfqString =
    filterObject.rfqNum && filterObject.rfqNum.length > 0
      ? `filter[id]=${filterObject.rfqNum}`
      : "";
  let poString =
    filterObject.poNum && filterObject.poNum.length > 0
      ? `filter[purchase-order-id]=${filterObject.poNum}`
      : "";
  let distributorString =
    filterObject.distributor && filterObject.distributor.length > 0
      ? `filter[distributor-ids]=${separateByComma(
          filterObject.distributor,
          "id"
        )}`
      : "";
  let userString =
    filterObject.user && filterObject.user.length > 0
      ? `filter[user-ids]=${separateByComma(filterObject.user, "id")}`
      : "";
  let purchaserString =
    filterObject.purchaser && filterObject.purchaser.length > 0
      ? `filter[purchaser-ids]=${separateByComma(filterObject.purchaser, "id")}`
      : "";
  let progString =
    filterObject.program && filterObject.program.length > 0
      ? `filter[program-ids]=${separateByComma(filterObject.program, "id")}`
      : "";
  let brandString =
    filterObject.brand && filterObject.brand.length > 0
      ? `filter[brand-ids]=${separateByComma(filterObject.brand, "id")}`
      : "";
  let itemTypeString =
    filterObject.itemType && filterObject.itemType.length > 0
      ? `filter[item-type-ids]=${separateByComma(filterObject.itemType, "id")}`
      : "";
  let buString =
    filterObject.bu && filterObject.bu.length > 0
      ? `filter[business-unit-ids]=${separateByComma(filterObject.bu, "id")}`
      : "";
  let favItemString =
    filterObject.favItems && filterObject.favItems.length > 0
      ? `filter[ids]=${separateByComma(filterObject.favItems, "id")}`
      : "";
  let supplierString =
    filterObject.supplier && filterObject.supplier.length > 0
      ? `filter[supplier-ids]=${separateByComma(filterObject.supplier, "id")}`
      : "";
  let ruleTypeString =
    filterObject.ruleType && filterObject.ruleType.length > 0
      ? filterObject.ruleType === "all"
        ? ""
        : `filter[type]=${filterObject.ruleType}`
      : "";
  let isVisibleString = filterObject.isItemVisible
    ? filterObject.isItemArchived
      ? `filter[is-visible]=true`
      : `filter[is-visible]=true&filter[is-active]=true`
    : "";
  let isOrderableString = filterObject.isItemOrderable
    ? `filter[is-orderable]=true`
    : "";
  let isArchivedString = filterObject.isItemArchived
    ? `filter[is-archived]=true`
    : "";
  let stateString =
    filterObject.stateIds && filterObject.stateIds.length > 0
      ? `filter[state-ids]=${separateByComma(filterObject.stateIds, "id")}`
      : "";
  let currentTerritoryString =
    filterObject.currentTerritoryId && type === "item"
      ? `filter[program-territory-ids]=${filterObject.currentTerritoryId}`
      : "";
  let orderItemIdString =
    filterObject.orderItemIds && filterObject.orderItemIds.length > 0
      ? `filter[ids]=${filterObject.orderItemIds}`
      : "";
  let isPreOrderActiveString = filterObject.isPreOrderActive
    ? "filter[is-pre-order-active]=true"
    : "";

  let queryArray = [
    uniqueFilter,
    typeString,
    orderTypeString,
    statusString,
    shipHoldString,
    dateString,
    seqString,
    rfqString,
    poString,
    distributorString,
    progString,
    brandString,
    itemTypeString,
    buString,
    favItemString,
    userString,
    purchaserString,
    supplierString,
    ruleTypeString,
    isVisibleString,
    isOrderableString,
    isArchivedString,
    stateString,
    currentTerritoryString,
    orderItemIdString,
    isPreOrderActiveString,
    sortString,
  ];

  let queryStringAppend = queryArray
    .filter((query) => query.length !== 0)
    .join("&");
  let filterPreCursor = queryStringAppend.length !== 0 ? "?" : "";

  let queryString = urlBase + filterPreCursor + queryStringAppend;
  return queryString;
};

export const handleErrors = (err) => {
  if (err.response) {
    if (
      err.response.data.errors &&
      err.response.data.errors[0] &&
      err.response.data.errors[0].title
    ) {
      return err.response.data.errors[0].title;
    } else if (err.response.data.errors && err.response.data.errors.detail) {
      return err.response.data.errors.detail;
    } else if (err.response.errors && err.response.errors.detail) {
      return err.response.errors.detail;
    } else if (err.response.data) {
      return err.response.data;
    } else return "Unknown Error";
  } else {
    return "Unknown Error";
  }
};
