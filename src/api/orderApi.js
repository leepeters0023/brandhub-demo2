import axios from "axios";
import Jsona from "jsona";

import { buildFilters, handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

// ------------ Order Set Calls ------------ //

//Returns all orders in an order set based on the program and current user's territory
export const fetchOrdersByProgram = async (program, userId, terrId) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/order-sets?filter[type]=pre-order&filter[program_ids]=${program}&filter[user-ids]=${userId}&filter[territory-ids]=${terrId}&filter[is-pre-order-active]=true`
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns all orders in an order set based on the order set's id
export const fetchOrderSetById = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/order-sets/${id}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns all pre-order order sets based on current user's territory
export const fetchAllPreOrders = async (id, terrId) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/order-sets?filter[type]=pre-order&filter[user-ids]=${id}&filter[territory-ids]=${terrId}&filter[is-pre-order-active]=true`
    )
    .then((res) => {
      let dataObject = { preOrders: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.preOrders = data;
      dataObject.nextLink = res.data.links ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns order set history based on filters, paginated in groups of 20
export const fetchAllFilteredOrderSets = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  const sortMap = {
    user: "user-name",
    state: "distributor-state",
    program: "program-name",
    orderDate: "submitted-at",
  };
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/order-sets",
    "order-set-history"
  );
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        orders: null,
        nextLink: null,
        orderCount: null,
        queryTotal: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      dataObject.orderCount = res.data.meta["total_entries"]
        ? res.data.meta["total_entries"]
        : null;
      dataObject.queryTotal = res.data.meta["total_cost"]
        ? res.data.meta["total_cost"]
        : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//If initial order set fetch would have more than 20 responses, this call handles the next page
export const fetchNextOrderSets = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        orders: null,
        nextLink: null,
        orderCount: null,
        queryTotal: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      dataObject.orderCount = res.data.meta["total_entries"]
        ? res.data.meta["total_entries"]
        : null;
      dataObject.queryTotal = res.data.meta["total_cost"]
        ? res.data.meta["total_cost"]
        : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchOrderSetItems = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  const sortMap = {
    itemNumber: "item-number",
    program: "program-name",
    itemType: "item-type-description",
    user: "user-name",
    orderDate: "order-set-submitted-at",
  };
  let sortString = `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/order-set-item-summaries",
    "order-set-items"
  );
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchNextOrderSetItems = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

/*Users can only have one active On-demand or In-stock order set in draft
status at a time, so this call will get their current order-set by type*/
export const fetchSingleOrderSetByType = async (type, userId) => {
  const response = { status: "", error: null, data: null };
  let formattedType = type === "inStock" ? "in-stock" : "on-demand";
  await axios
    .get(
      `/api/order-sets?filter[user-ids]=${userId}&filter[type]=${formattedType}&filter[status]=in-progress,inactive`
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Updates notes on an order set, may or may not be keeping this call
export const setOrderSetNote = async (id, note) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/order-sets/${id}`,
      {
        data: {
          type: "order-set",
          id: id,
          attributes: {
            notes: note,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const addSingleOrderToSet = async (id, dist, type, warehouse) => {
  const response = { status: "", error: null, data: null };
  let requestData = warehouse
    ? {
        data: {
          type: "order",
          attributes: {
            type: type,
            warehouse: warehouse,
          },
          relationships: {
            distributor: {
              data: {
                type: "distributor",
                id: dist,
              },
            },
            "order-set": {
              data: {
                type: "order-set",
                id: id,
              },
            },
          },
        },
      }
    : {
        data: {
          type: "order",
          attributes: {
            type: type,
          },
          relationships: {
            distributor: {
              data: {
                type: "distributor",
                id: dist,
              },
            },
            "order-set": {
              data: {
                type: "order-set",
                id: id,
              },
            },
          },
        },
      };
  await axios
    .post("/api/orders", requestData, writeHeaders)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const addCustomAddressOrderToSet = async (id, addId, type) => {
  const response = { status: "", error: null, data: null };
  await axios
    .post(
      "/api/orders",
      {
        data: {
          type: "order",
          attributes: {
            type: type,
          },
          relationships: {
            "order-set": {
              data: {
                type: "order-set",
                id: id,
              },
            },
            "custom-address": {
              data: {
                type: "address",
                id: addId,
              },
            },
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

/*
  The following calls handle order set statuses.  The status of
  an order set determines whether it can move to the next step in
  the order process. Order-sets go from inactive to draft to submitted
  to approved.  An order set in draft can not jump straight to approved.
  */

//Updates status of order set from inactive to draft status
export const startOrderSet = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/order-sets/${id}/start`, null, writeHeaders)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns and order set to draft status from being submitted
export const restartOrderSet = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/order-sets/${id}/restart`, null, writeHeaders)
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//sets work complete boolean on order set for ui display
export const setWorkComplete = async (id, status) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/order-sets/${id}`,
      {
        data: {
          type: "order-set",
          id: id,
          attributes: {
            "is-work-complete": status,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Updates status of order set from draft to submitted
export const submitOrderSet = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/order-sets/${id}/submit`, null, writeHeaders)
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Updates status of order set from submitted to approved
export const approveOrderSet = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/order-sets/${id}/approve`, null, writeHeaders)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Permanently deletes an order set item with matching id
export const deleteOrderSetItem = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(
      `/api/order-set-items/${id}`,
      {
        data: {
          type: "order-set-item",
          id: id,
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Permanently deletes an order set
export const deleteOrderSet = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(
      `/api/order-sets/${id}`,
      {
        data: {
          type: "order-set",
          id: id,
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Creates a new order set and returns the new order set
export const createOrderSet = async (type, territoryId, programId) => {
  const response = { status: "", error: null, data: null };
  let formattedType =
    type === "inStock"
      ? "in-stock"
      : type === "onDemand"
      ? "on-demand"
      : "pre-order";
  const requestData = programId
    ? {
        data: {
          type: "order-set",
          attributes: {
            type: formattedType,
          },
          relationships: {
            territory: {
              data: {
                type: "territory",
                id: territoryId,
              },
              program: {
                data: {
                  type: "program",
                  id: programId,
                },
              },
            },
          },
        },
      }
    : {
        data: {
          type: "order-set",
          attributes: {
            type: formattedType,
          },
          relationships: {
            territory: {
              data: {
                type: "territory",
                id: territoryId,
              },
            },
          },
        },
      };
  await axios
    .post("/api/order-sets", requestData, writeHeaders)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.data = data;
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Adds an item to an order set, must submit the order set id and item id
export const addOrderSetItem = async (id, item) => {
  const response = { status: "", error: null, data: null };
  await axios
    .post(
      "/api/order-set-items",
      {
        data: {
          type: "order-set-item",
          relationships: {
            "order-set": {
              data: {
                type: "order-set",
                id: id,
              },
            },
            item: {
              data: {
                type: "item",
                id: item,
              },
            },
          },
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const updateOrderSetItemDate = async (id, date) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/order-set-items/${id}`,
      {
        data: {
          type: "order-set-item",
          id: id,
          attributes: {
            "in-market-date": date,
          },
        },
      },
      writeHeaders
    )
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const updateOrderSetItemRush = async (id, status) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/order-set-items/${id}`,
      {
        data: {
          type: "order-set-item",
          id: id,
          attributes: {
            "is-rush": status,
          },
        },
      },
      writeHeaders
    )
    .then((_res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

// ------------ Single Order Calls ------------ //

//Returns all single orders based on filters, paginated in groups of 20
export const fetchOrderHistory = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  const sortMap = {
    id: "id",
    distributor: "distributor-name",
    state: "distributor-state",
    orderDate: "submitted-at",
    shipDate: "ship-date",
    status: "status",
  };
  let sortString = `&sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/orders",
    "history"
  );
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { orders: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//If initial order fetch would have more than 20 responses, this call handles the next page
export const fetchNextHistory = async (url) => {
  const response = { status: "", error: null, data: null };
  let queryString = decodeURIComponent(url).split("+").join(" ");
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { orders: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchOrderHistoryByItem = async (filterObject) => {
  const sortMap = {
    itemNumber: "item-number",
    distributor: "distributor-name",
    itemType: "item-type-description",
    orderNum: "order-id",
    orderDate: "order-submitted-at",
    shipDate: "order-shipped-at",
  };
  let sortString = filterObject.sortOrder
    ? `sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
        sortMap[filterObject.sortOrderBy]
      }`
    : "";

  let queryString = buildFilters(
    filterObject,
    "",
    sortString,
    "/api/order-items",
    "history-items"
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchNextOrderHistoryByItem = async (url) => {
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
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns single order based on it's id
export const fetchSingleOrder = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/orders/${id}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Updates the quantity of a single item on an order
export const patchOrderItem = async (id, qty) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/order-items/${id}`,
      {
        data: {
          type: "order-item",
          id: id,
          attributes: {
            qty: qty,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Updates the note and attention line on an order
export const setOrderDetail = async (id, note, attn) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/orders/${id}`,
      {
        data: {
          type: "order",
          id: id,
          attributes: {
            notes: note,
            attn: attn,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Permanentely deletes an order
export const deleteOrder = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(
      `/api/orders/${id}`,
      {
        data: {
          type: "order",
          id: id,
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Permanentely deletes an order item
export const deleteOrderItem = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(
      `/api/order-items/${id}`,
      {
        data: {
          type: "order-item",
          id: id,
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const complianceCancelOrderItem = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(
      `/api/order-items/${id}/compliance-cancel`,
      {
        data: {
          type: "order-item",
          id: id,
        },
      },
      writeHeaders
    )
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};
