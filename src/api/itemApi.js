import axios from "axios";
import Jsona from "jsona";

import { buildFilters, handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

//Returns items based on filters, see todo above.
export const fetchItems = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  let marketString = filterObject.isOnPremise
    ? "filter[channel]=on_premise"
    : "filter[channel]=retail";
  const queryString = buildFilters(filterObject, marketString, "", "/api/items", "item");
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchNextItems = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns item types and returns an array of all available item types
export const fetchItemTypes = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/item-types")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchSharedItems = async (ids) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/items?filter[ids]=${ids}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchBusinessUnits = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/business-units")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};
