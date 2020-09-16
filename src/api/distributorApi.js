import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

export const fetchDistributors = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/distributors")
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