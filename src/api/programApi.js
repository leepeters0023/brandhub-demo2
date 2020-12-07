import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//Returns all active programs based on current users territory
export const fetchProgramsByTerritory = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/programs?filter[territory_id]=${id}&filter[item-order-type]=pre-order`)
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

//Returns all active National programs (not dependant on a territory)
export const fetchNationalPrograms = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/programs?filter[type]=National&filter[item-order-type]=pre-order`)
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
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

//Returns an array of programs based on partial matches to the submitted name
export const fetchProgramsByName = async (name) => {
  const response = { status: "", error: null, data: null }
  await axios
    .get(`/api/programs?filter[name]=${name}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error"
      response.error = err.toString();
    })
  return response;
}
