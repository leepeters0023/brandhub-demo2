import axios from "axios";
import Jsona from "jsona";

import { buildFilters } from "./apiFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
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
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

//Returns rollup items for the rfq and po process based on filters and the view, paginated in groups of 20
export const fetchRollupItems = async (filterObject, type) => {
  const sortMap = {
    sequenceNum: "item-number",
    program: "order-program-name",
    itemType: "item-type-description",
    dueDate: "order-due-date",
  };

  let typeBool = `filter[is-for-rfq]=${type === "rfq" ? true : false}`;
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;

  let queryString = buildFilters(filterObject, typeBool, sortString, "/api/item-rollups", "rollup")

  const response = { status: "", error: null, data: null };
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { items: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      console.log(data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
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

//Handles next page for rollup items
export const fetchNextRollupItems = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { items: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
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

//Creates a new RFQ based on an item and it's associated program
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

//Updates the note on an RFQ
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
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

//Updates the due date or in market date on an RFQ
export const updateRFQDate = async (id, dateType, date) => {
  const response = { status: "", error: null };
  console.log(date);
  await axios
    .patch(
      `/api/request-for-quotes/${id}`,
      {
        data: {
          type: "request-for-quote",
          id: id,
          attributes: {
            [`${dateType}`]: date,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      const data = dataFormatter.deserialize(res.data);
      console.log(data);
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

//Accepts an array of supplier ids, and sends bid requests to those suppliers
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

//Returns rfqs based on filters, paginated in groups of 20
export const fetchRFQHistory = async (filterObject) => {
  const sortMap = {
    sequenceNum: "item-number",
    rfqNum: "id",
    program: "program-name",
    itemType: "item-type-description",
    dueDate: "due-date",
    status: "status",
  };
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString = buildFilters(filterObject, "", sortString, "/api/request-for-quotes", "rfq-history")

  const response = { status: "", error: null, data: null };
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        rfqs: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
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

//Handles next page for rfq history
export const fetchNextRFQHistory = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        rfqs: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
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

//Returns a single RFQ based on it's id
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
