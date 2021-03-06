import axios from "axios";
import Jsona from "jsona";
import { handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

//Returns a filtered array of brands based on partial matches to their name
export const fetchBrandsByName = async (name) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/brands?filter[name]=${name}`)
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
