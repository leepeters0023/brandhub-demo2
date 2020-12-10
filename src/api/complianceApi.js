import axios from "axios";
import Jsona from "jsona";

import { buildFilters } from "./apiFunctions";

const dataFormatter = new Jsona();

// const writeHeaders = {
//   headers: {
//     Accept: "application/vnd.api+json",
//     "Content-Type": "application/vnd.api+json",
//   },
// };

export const fetchAllRules = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  let queryString = buildFilters(
    filterObject,
    "",
    "",
    "/api/rules",
    "compliance"
  )
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null }
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}

export const fetchNextRules = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null }
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}

export const fetchTriggeredRules = async (filterObject) => {
  const response = { status: "", error: null, data: null }
  let queryString = buildFilters(
    filterObject,
    "",
    "",
    "/api/triggered-rules",
    "compliance"
  )
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null }
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}

export const fetchNextTriggeredRules = async (url) => {
  const response = { status: "", error: null, data: null }
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null }
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}