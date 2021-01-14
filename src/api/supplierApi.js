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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
    });
  return response;
};
