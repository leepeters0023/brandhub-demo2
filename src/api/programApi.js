import axios from "axios";
import Jsona from "jsona";
import { handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

//Returns all active programs based on current users territory
export const fetchProgramsByTerritory = async (id, channelBool) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/programs?filter[territory-id]=${id}&filter[is-pre-order]=true&filter[is-pre-order-active]=true&filter[channel]=${
        channelBool ? "on_premise" : "retail"
      }`
    )
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

//Returns all active National programs (not dependant on a territory)
export const fetchNationalPrograms = async (channelBool) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/programs?filter[type]=National&filter[is-pre-order]=true&filter[is-pre-order-active]=true&filter[channel]=${
        channelBool ? "on_premise" : "retail"
      }`
    )
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};
