import axios from "axios";
import Jsona from "jsona";
import { handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchCompliantStates = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/states?filter[compliant-for-shipping-parameter-id]=${id}`)
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

export const createTerritory = async (name, states, externalId, type) => {
  const response = { status: "", error: null, data: null };
  const stateArray = states.map((st) => ({ type: "state", id: st.id }));
  await axios
    .post(
      "/api/territories",
      {
        data: {
          type: "territory",
          attributes: {
            name: name,
            type: type,
            "external-id": externalId,
          },
          relationships: {
            states: {
              data: stateArray,
            },
          },
        },
      },
      writeHeaders
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

export const updateTerritory = async (name, states, id) => {
  const response = { status: "", error: null, data: null };
  const stateArray = states.map((st) => ({ type: "state", id: st.id }));
  await axios
    .patch(
      `/api/territories/${id}`,
      {
        data: {
          type: "territory",
          id: id,
          attributes: {
            name: name,
          },
          relationships: {
            states: {
              data: stateArray,
            },
          },
        },
      },
      writeHeaders
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
