import axios from "axios";
import Jsona from "jsona";

import { buildFilters, handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

export const fetchOrderItemReport = async (filterObject) => {
  let sortString = `sort=item-number`;
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/order-items",
    "history-items"
  );
  queryString += "&page[size]=10"
  let next = "start";
  let dataArray = [];
  const response = { status: "", error: null, data: null };
  while (next) {
    await axios
      .get(next === "start" ? queryString : next)
      // eslint-disable-next-line no-loop-func
      .then((res) => {
        let data = dataFormatter.deserialize(res.data);
        dataArray = dataArray.concat(data);
        next = res.data.links.next ? res.data.links.next : null;
      })
      // eslint-disable-next-line no-loop-func
      .catch((err) => {
        const error = handleErrors(err);
        console.log(error);
        response.status = "error";
        response.error = error;
      });
  }
  if (!response.error) {
    response.status = "ok";
    response.data = dataArray;
  }
  return response;
};
