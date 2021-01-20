import axios from "axios";
import Jsona from "jsona";

import { buildFilters } from "./apiFunctions";

const dataFormatter = new Jsona();

//Returns items based on filters, see todo above.
export const fetchItems = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  //let marketString = `filter[is-on-premise]=${filterObject.isOnPremise ? true : false}`
  const queryString = buildFilters(filterObject, /*marketString*/ "", "", "/api/items", "item");
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
    });
  return response;
};
