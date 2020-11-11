import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//TODO incorporate item type (instock vs ondemand), filters, pagination ...

//Returns items based on filters, see todo above.
export const fetchItems = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  /*
  let progString = filterObject.program.length > 0
    ? `&filter[program-id]=${separateByComma(filterObject.program, "id")}`
    : "";
  let brandString = filterObject.brand.length > 0
    ? `&filter[brand-id]=${separateByComma(filterObject.brand, "id")}`
    : "",
  let itemTypeString = filterObject.itemType.length > 0
    ? `&filter[item-type-id]=${separateByComma(filterObject.itemType, "id")}`
    : "",

    bu ? id or string...
  */
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `?filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let queryString = "/api/items" + seqString;
  await axios
    .get(queryString)
    .then((res) => {
      console.log(res)
      let data = dataFormatter.deserialize(res.data);
      console.log(data)
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

//Returns item types and returns an array of all available item types
export const fetchItemTypes = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/item-types")
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
