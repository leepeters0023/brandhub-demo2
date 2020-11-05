import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//Returns a filtered array of distributors based on partial matches to their name
export const fetchDistributors = async (name) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/distributors?filter[name]=${name}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error"
      response.error = err.toString();
    });
  return response;
}