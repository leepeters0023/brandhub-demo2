import axios from "axios";
import Jsona from "jsona";

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
