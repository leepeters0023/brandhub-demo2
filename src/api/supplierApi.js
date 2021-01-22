import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//Returns suppliers based on name
export const fetchFilteredSuppliers = async (name) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/suppliers?filter[name]=${name}`)
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

//Returns all active suppliers
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

export const fetchInitialSupplierValues = async () => {
  const response = { status: "", error: null, data: null };
  const valueObj = {
    newRFQ: 0,
    inProgressRFQ: 0,
    awardedRFQ: 0,
    newPO: 0,
    inProgressPO: 0,
    shipHoldPO: 0,
  };
  const errors = [];
  let currentError = null;
  await axios
    .get("/api/request-for-quotes?filter[status]=new")
    .then((res) => {
      valueObj.newRFQ = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  await axios
    .get("/api/request-for-quotes?filter[status]=in-progress")
    .then((res) => {
      valueObj.inProgressRFQ = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  await axios
    .get("/api/request-for-quotes?filter[status]=awarded")
    .then((res) => {
      valueObj.awardedRFQ = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  await axios
    .get("/api/purchase-order-items?filter[status]=submitted")
    .then((res) => {
      valueObj.newPO = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  await axios
    .get(
      "/api/purchase-order-items?filter[status]=in-progress&filter[has-ship-hold]=false"
    )
    .then((res) => {
      valueObj.inProgressPO = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  await axios
    .get(
      "/api/purchase-order-items?filter[status]=in-progress&filter[has-ship-hold]=true"
    )
    .then((res) => {
      valueObj.shipHoldPO = res.data.meta.total_entries;
      currentError = null;
    })
    .catch((err) => {
      console.log(
        err.response.data.errors
          ? err.response.data.errors[0].title
          : err.response.data
      );
      currentError = err.response.data.errors
        ? err.response.data.errors[0].title
        : err.response.data;
      errors.push(currentError);
    });

  if (errors.length === 0) {
    response.status = "Ok";
    response.error = null;
    response.data = valueObj;
  } else {
    response.status = "error";
    response.error = errors.join(", ");
  }

  return response;
};
