import axios from "axios";
import Jsona from "jsona";

//import { separateByComma } from "../utility/utilityFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

export const fetchSuppliers = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/suppliers")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchRFQItems = async () => {
  //TODO add filters
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/item-for-quotes")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const createRFQ = async (item, user) => {
  const response = { status: "", error: null, data: null };
  let requestBody = user ? {
    data: {
      type: "request-for-quote",
      relationships: {
        item: {
          data: {
            type: "item",
            id: item,
          },
        },
        user: {
          data: {
            type: "user",
            id: user,
          },
        },
      },
    },
  } : {
    data: {
      type: "request-for-quote",
      relationships: {
        item: {
          data: {
            type: "item",
            id: item,
          },
        }
      },
    },
  }
  await axios
    .post(
      "/api/request-for-quotes",
      requestBody,
      writeHeaders
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.data = data;
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};
