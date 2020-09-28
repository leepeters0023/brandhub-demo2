import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

export const fetchProgramsByTerritory = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/programs?filter[territory_id]=${id}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchNationalPrograms = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/programs?filter[type]=national`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchProgramItems = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/items?filter[program-id]=${id}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};
