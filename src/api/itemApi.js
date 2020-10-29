import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//TODO incorporate limit, item type (instock vs ondemand), filters, pagination ...
// export const fetchFilteredItems = async (filters) => {
//   const response = { status: "", error: null, data: null };
//   let filterString = "";
//   await axios
//     .get()
// }

export const fetchItems = async (filterObject) => {
  console.log(filterObject);
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
  console.log(queryString);
  await axios
    .get(queryString)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      console.log(data);
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
