import axios from "axios";
import Jsona from "jsona";

//import { separateByComma } from "../utility/utilityFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

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
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchRFQItems = async (filterObject) => {
  //TODO add filters
  //let typeString = `?filter[order-type]=${filterObject.orderType}`;
  /* 
  let userString = filterObject.user.length > 0
    ? `&filter[user-id]=${separateByComma(filterObject.user, "id")}`
    : "";
  let progString = filterObject.program.length > 0
    ? `&filter[program-id]=${separateByComma(filterObject.program, "id")}`
    : "";
  let brandString = filterObject.brand.length > 0
    ? `&filter[brand-id]=${separateByComma(filterObject.brand, "id")}`
    : "",
  let itemTypeString = filterObject.itemType.length > 0
    ? `&filter[item-type-id]=${separateByComma(filterObject.itemType, "id")}`
    : "",
  */
  let queryString = "/api/item-for-quotes"

  const response = { status: "", error: null, data: null };
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

export const createRFQ = async (item, program) => {
  console.log(program)
  const response = { status: "", error: null, data: null };
  let requestBody = {
        data: {
          type: "request-for-quote",
          relationships: {
            item: {
              data: {
                type: "item",
                id: item,
              },
            },
            program: {
              data: {
                type: "program",
                id: program,
              },
            },
          },
        },
      }
  await axios
    .post("/api/request-for-quotes", requestBody, writeHeaders)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.data = data;
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

export const sendBidRequests = async (idArray, rfqId) => {
  const response = { status: "", error: null, data: null };
  const newIds = idArray.map(id => parseInt(id));
  await axios
    .post(`/api/request-for-quotes/${rfqId}/send`, {
      data: {
        id: rfqId,
        type: "request-for-quote",
        supplier_ids: newIds,
      }
    }, writeHeaders)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.data = data;
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
}

export const fetchRFQHistory = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  //TODO add filter logic
  console.log(filterObject);
  await axios
    .get("/api/request-for-quotes")
    .then((res) => {
      let dataObject = {
        rfqs: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      console.log(res.data);
      dataObject.rfqs = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchRFQ = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/request-for-quotes/${id}`)
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
