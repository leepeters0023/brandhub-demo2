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

export const setPreOrderProgramStatus = async (id, value) => {
  const response = { status: "", error: null };
  let headers = {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
  };
  await axios
    .patch(
      `/api/pre-orders/${id}`,
      {
        data: {
          type: "pre-order",
          id: id,
          attributes: {
            "status": value,
          },
        },
      },
      headers
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};
