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

  let queryString = buildFilters(
    filterObject,
    typeBool,
    sortString,
    "/api/item-rollups",
    "rollup"
  );

  const response = { status: "", error: null, data: null };
  await axios
    .get(queryString)
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
  const response = { status: "", error: null, data: null };
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
      response.status = "ok";
      response.data = data;
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
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/request-for-quotes",
    "rfq-history"
  );

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

//Creates a new PO based on an item and it's associated program
export const createPO = async (ids) => {
  const response = { status: "", error: null, data: null };
  let requestBody = {
    data: {
      type: "purchase-order",
      attributes: {
        "order-item-ids": ids,
      },
    },
  };
  await axios
    .post("/api/purchase-orders", requestBody, writeHeaders)
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

export const addToPO = async (ids, poNum) => {
  const response = { status: "", error: null, data: null };
  let requestBody = {
    data: {
      type: "purchase-order",
      attributes: {
        "order-item-ids": ids,
      },
    },
  };
  await axios
    .patch(`/api/purchase-orders/${poNum}`, requestBody, writeHeaders)
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

//Updates the note on an PO
export const updatePONote = async (id, note) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/purchase-orders/${id}`,
      {
        data: {
          type: "purchase-order",
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

export const updatePOTape = async (id, tape) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/purchase-orders/${id}`,
      {
        data: {
          type: "purchase-order",
          id: id,
          attributes: {
            "key-account-tape": tape,
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
}

//Updates date fields on the PO
export const updatePODate = async (id, dateType, date) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/purchase-orders/${id}`,
      {
        data: {
          type: "purchase-order",
          id: id,
          attributes: {
            [`${dateType}`]: date,
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

export const updatePODirectShip = async (id, value) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/purchase-orders/${id}`,
      {
        data: {
          type: "purchase-order",
          id: id,
          attributes: {
            "is-direct-ship": value,
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
}

//Adds additional line items (like a set up fee) to a po
export const addAdditionalPOCost = async (id, name, cost) => {
  const response = { status: "", errror: null };
  await axios
    .post(
      "/api/purchase-order-items",
      {
        data: {
          type: "purchase-order-item",
          attributes: {
            "item-type-description": "Additional PO Cost",
            name: name,
            cost: cost,
          },
          relationships: {
            "purchase-order": {
              data: {
                type: "purchase-order",
                id: id,
              },
            },
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

//Updates the actual cost of an item on a po
export const updatePOItemCost = async (id, cost) => {
  const response = { status: "", errror: null };
  await axios
    .patch(
      `/api/purchase-order-items/${id}`,
      {
        data: {
          type: "purchase-order-item",
          id: id,
          attributes: {
            "actual-cost": cost,
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

export const updatePOItemPackSize = async (id, packSize) => {
  const response = { status: "", errror: null };
  await axios
    .patch(
      `/api/purchase-order-items/${id}`,
      {
        data: {
          type: "purchase-order-item",
          id: id,
          attributes: {
            "actual-qty-per-pack": packSize,
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

export const updatePOItemPackOut = async (id, value) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/purchase-order-items/${id}`,
      {
        data: {
          type: "purchase-order-item",
          id: id,
          attributes: {
            "has-packout": value,
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
}

export const deletePOItem = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(`/api/purchase-order-items/${id}`)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const submitPO = async (id) => {
  const response = { status: "", error: null };
  //TODO confirm this is the correct route
  await axios
    .post(`/api/purchase-orders/${id}/submit`, null, writeHeaders)
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

export const deletePO = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(`/api/purchase-orders/${id}`)
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

//Updates shipping params on csv upload
export const updateShippingParams = async (updateArray) => {
  const response = { status: "", error: null, data: null };
  await axios
    .put("/api/shipping-parameter-items/add-shipping-extras",
      {
        "shipping-parameter-items": updateArray
      },
      writeHeaders
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data)
      response.data = data;
      response.status = "ok"
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}

//Returns po items based on filters, paginated in groups of 20
export const fetchPOHistory = async (filterObject) => {
  const sortMap = {
    poNum: "po-id",
    supplier: "supplier-name",
    dueDate: "po-in-market-date",
    status: "po-status",
  };
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/purchase-order-items",
    "po-history"
  );

  const response = { status: "", error: null, data: null };
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        pos: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.pos = data;
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

//Handles next page for po history
export const fetchNextPOHistory = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        pos: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.pos = data;
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

//Returns a single PO based on it's id
export const fetchPO = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/purchase-orders/${id}`)
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
