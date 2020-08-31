import axios from "axios";
import orders from "../assets/mockdata/Orders";

export const fetchProgramsByTerritory = async (id) => {
  const response = { status: "", error: null, data: null };
  await timeout(1000)
  await axios
    .get(`/api/programs?filter[territory_id]=${id}`)
    .then((res) => {
      response.status = "ok";
      response.data = res.data;
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
      response.status = "ok";
      response.data = res.data;
    })
    .catch((err) => {
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

//mock fetch

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fetchOrdersByProgram = async (user, program) => {
  await timeout(1000);
  //fetch to api with user and program for orders relating to that program
  if (program === "10") {
    return orders;
  } else return [];
};
