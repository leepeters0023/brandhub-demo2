import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//TODO incorporate limit, item type (instock vs ondemand), filters, pagination ... 
export const fetchItems = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/items`)
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
}