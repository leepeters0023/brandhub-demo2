import axios from "axios";
import Jsona from "jsona";

import { buildFilters } from "./apiFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

export const fetchAllRules = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  let queryString = buildFilters(
    filterObject,
    "",
    "",
    "/api/rules",
    "compliance"
  );
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};

export const fetchNextRules = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};

export const fetchTriggeredRules = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  let queryString = buildFilters(
    filterObject,
    "",
    "",
    "/api/triggered-rules",
    "compliance"
  );
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};

export const fetchNextTriggeredRules = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { rules: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.rules = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};

export const approveOrDenyItem = async (token, itemStatus) => {
  const response = { status: "", error: null };
  await axios
    .post(
      `/api/public/triggered-rules/${token}/${
        itemStatus === "approved" ? "approve" : "deny"
      }`,
      {},
      writeHeaders
    )
    .then((res) => {
      response.status = itemStatus;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};
