import { separateByComma } from "../utility/utilityFunctions";

/*
Builds the string of filters used when querying the api, currently not
tied into everything as we are still updating filters for a lot of the
routes, but eventually will be tied in to all queries with filters
*/
//TODO add missing filters when they work correctly
export const buildFilters = (
  filterObject,
  uniqueFilter,
  sortString,
  urlBase
) => {
  let statusString =
    filterObject.status && filterObject.status.length > 0
      ? filterObject.status === "all"
        ? ""
        : `filter[status]=${filterObject.status}`
      : "";
  let typeString = filterObject.type ? `filter[type]=${filterObject.type}` : "";
  let orderTypeString = filterObject.orderType
    ? `filter[order-type]=${filterObject.orderType}`
    : "";
  let dateString =
    filterObject.fromDate &&
    filterObject.toDate &&
    filterObject.status === "submitted"
      ? `filter[submitted-at-range]=${filterObject.fromDate} - ${filterObject.toDate}`
      : "";
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let rfqString =
    filterObject.rfqNum && filterObject.rfqNum.length > 0
      ? `filter[id]=${filterObject.rfqNum}`
      : "";
  let poString =
    filterObject.poNum && filterObject.poNum.length > 0
      ? `filter[id]=${filterObject.poNum}`
      : "";
  let userString =
    filterObject.user && filterObject.user.length > 0
      ? `filter[user-ids]=${separateByComma(filterObject.user, "id")}`
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
  let supplierString =
    filterObject.supplier && filterObject.supplier.length > 0
      ? `filter[supplier-ids]=${separateByComma(filterObject.supplier, "id")}`
      : "";

  let queryArray = [
    uniqueFilter,
    typeString,
    orderTypeString,
    statusString,
    dateString,
    seqString,
    rfqString,
    poString,
    progString,
    brandString,
    itemTypeString,
    userString,
    supplierString,
    sortString,
  ];

  let queryStringAppend = queryArray
    .filter((query) => query.length !== 0)
    .join("&");
  let filterPreCursor = queryStringAppend.length !== 0 ? "?" : "";

  let queryString = urlBase + filterPreCursor + queryStringAppend;

  console.log(queryString);
  return queryString;
};
