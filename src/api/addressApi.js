import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

export const fetchWarehouseAddress = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/addresses?filter[type]=warehouse")
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
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};

export const addAddress = async (address) => {
  const response = { status: "", error: null, data: null };
  await axios
    .post(
      "/api/addresses",
      {
        data: {
          type: "address",
          attributes: {
            name: address.name,
            "street-address-1": address.addressOne,
            "street-address-2": address.addressTwo,
            city: address.city,
            zip: address.zip,
            country: address.country,
            type: "custom",
          },
          relationships: {
            state: {
              data: {
                type: "state",
                id: address.state,
              },
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
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout"
      );
      response.status = "error";
      response.error =
        err.response && err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response
          ? err.response.data
          : "Request Timeout";
    });
  return response;
};
