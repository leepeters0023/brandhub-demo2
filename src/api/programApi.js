import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//Returns all active programs based on current users territory
export const fetchProgramsByTerritory = async (id, marketBool) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/programs?filter[territory-id]=${id}&filter[is-pre-order]=true&filter[is-pre-order-active]=true&filter[is-on-premise]=${marketBool}`
      //`/api/programs?filter[territory-id]=${id}&filter[is-pre-order]=true&filter[is-pre-order-active]=true`
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong";
    });
  return response;
};

//Returns all active National programs (not dependant on a territory)
export const fetchNationalPrograms = async (marketBool) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/programs?filter[type]=National&filter[is-pre-order]=true&filter[is-pre-order-active]=true&filter[is-on-premise]=${marketBool}`
      //`/api/programs?filter[type]=National&filter[is-pre-order]=true&filter[is-pre-order-active]=true`
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong";
    });
  return response;
};

//Returns all items associated with the given program id
export const fetchProgramItems = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/items?filter[program-ids]=${id}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong";
    });
  return response;
};

//Returns an array of programs based on partial matches to the submitted name
export const fetchProgramsByName = async (name) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/programs?filter[name]=${name}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Something went wrong";
    });
  return response;
};
