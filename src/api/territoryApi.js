import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//Returns all territories
export const fetchAllTerritories = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/territories")
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

//Returns a filtered array of territories based on partial matches to their name

export const fetchFilteredTerritories = async (name) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/territories?filter[name]=${name}`)
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

export const fetchAllStates = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/states")
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

export const fetchFilteredStates = async (ids) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/states?filter[territory-id]=${ids.join(",")}`)
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
