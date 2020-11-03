import axios from "axios";
import Jsona from "jsona";

import { separateByComma } from "../utility/utilityFunctions";

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

export const fetchRollupItems = async (filterObject, type) => {
  const sortMap = {
    sequenceNum: "item-number",
    program: "order-program-name",
    itemType: "item-type-description",
    dueDate: "order-due-date",
  };
  let typeString = `?filter[order-type]=${filterObject.orderType}`;
  let typeBool = `&filter[is-for-rfq]=${type === "rfq" ? true : false}`;
  // let userString =
  //   filterObject.user.length > 0
  //     ? `&filter[user-ids]=${separateByComma(filterObject.user, "id")}`
  //     : "";
  let progString =
    filterObject.program.length > 0
      ? `&filter[program-ids]=${separateByComma(filterObject.program, "id")}`
      : "";
  let brandString =
    filterObject.brand.length > 0
      ? `&filter[brand-ids]=${separateByComma(filterObject.brand, "id")}`
      : "";
  let itemTypeString =
    filterObject.itemType.length > 0
      ? `&filter[item-type-ids]=${separateByComma(filterObject.itemType, "id")}`
      : "";
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `&filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let sortString = `&sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;

  let queryString =
    "/api/item-rollups" +
    typeString +
    typeBool +
    // userString +
    progString +
    brandString +
    itemTypeString +
    seqString +
    sortString;

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
  };
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

export const updateRFQNote = async (id, note) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/request-for-quotes/${id}`,
      {
        data: {
          type: "request-for-quote",
          id: id,
          attributes: {
            note: note,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
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
  const newIds = idArray.map((id) => parseInt(id));
  await axios
    .post(
      `/api/request-for-quotes/${rfqId}/send`,
      {
        data: {
          id: rfqId,
          type: "request-for-quote",
          supplier_ids: newIds,
        },
      },
      writeHeaders
    )
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

export const fetchRFQHistory = async (filterObject) => {
  const sortMap = {
    sequenceNum: "item-number",
    rfqNum: "id",
    program: "program-name",
    itemType: "item-type-description",
    dueDate: "due-date",
    status: "status",
  };
  let statusString =
    filterObject.status && filterObject.status.length > 0
      ? filterObject.status === "all"
        ? ""
        : `filter[status]=${filterObject.status}`
      : "";
  let progString =
    filterObject.program.length > 0
      ? `filter[program-ids]=${separateByComma(filterObject.program, "id")}`
      : "";
  let brandString =
    filterObject.brand.length > 0
      ? `filter[brand-ids]=${separateByComma(filterObject.brand, "id")}`
      : "";
  let itemTypeString =
    filterObject.itemType.length > 0
      ? `filter[item-type-ids]=${separateByComma(filterObject.itemType, "id")}`
      : "";
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let idString =
    filterObject.rfqNum && filterObject.rfqNum.length > 0
      ? `filter[id]=${filterObject.rfqNum}`
      : "";
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryArray = [
    statusString,
    progString,
    brandString,
    itemTypeString,
    seqString,
    idString,
    sortString,
  ];
  let queryStringAppend = queryArray
    .filter((query) => query.length !== 0)
    .join("&");
  let filterPreCursor = queryStringAppend.length !== 0 ? "?" : "";

  let queryString =
    "/api/request-for-quotes" + filterPreCursor + queryStringAppend;

  const response = { status: "", error: null, data: null };
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        rfqs: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      console.log(data);
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
};
