import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

export const fetchDistributorsByTerritory = async (id, stateIds) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/distributors?filter[territory-id]=${id}&filter[state-ids]=${stateIds}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

//Returns a filtered array of distributors based on partial matches to their name
export const fetchDistributors = async (name, territoryId, stateIds) => {
  const response = { status: "", error: null, data: null };
  const queryString = territoryId
    ? `/api/distributors?filter[name]=${name}&filter[territory-id]=${territoryId}&filter[state-ids]=${stateIds}`
    : `/api/distributors?filter[name]=${name}`;
  await axios
    .get(queryString)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

export const getFavDistributors = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/distributor-favorite-sets")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

export const newFavDistList = async (index) => {
  const response = { status: "", error: null, data: null };
  await axios
    .post(
      "/api/distributor-favorite-sets",
      {
        data: {
          type: "distributor-favorite-list",
          attributes: {
            name: `New List ${index}`,
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
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

export const updateFavDistList = async (id, name, distArray) => {
  const response = { status: "", error: null, data: null };
  await axios
    .patch(
      `/api/distributor-favorite-sets/${id}`,
      {
        data: {
          type: "distributor-favorite-list",
          attributes: {
            name: name,
          },
          relationships: {
            distributors: {
              data: distArray,
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
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

export const deleteFavDistList = async (id) => {
  const response = { status: "", error: "" };
  await axios
    .delete(`/api/distributor-favorite-sets/${id}`)
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};

export const editCustomAttentionLine = async (id, attn) => {
  const response = { status: "", error: null, data: null };
  await axios
    .patch(
      `/api/distributors/${id}/current-user-attn`,
      {
        "user-attn": attn,
      },
      writeHeaders
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      response.status = "error";
      response.error = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
    });
  return response;
};
