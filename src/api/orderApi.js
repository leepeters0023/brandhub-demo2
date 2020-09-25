import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

// -------------------------- Pre-Order Calls ------------------------- //

export const fetchOrdersByProgram = async (program, userId) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(
      `/api/pre-orders?filter[program_id]=${program}&filter[user-id]=${userId}`
    )
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

export const fetchPreOrderById = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/pre-orders/${id}`)
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

export const fetchAllPreOrders = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/pre-orders?filter[user-id]=${id}`)
    .then((res) => {
      let dataObject = { preOrders: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.preOrders = data;
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

export const fetchAllFilteredPreOrders = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  const sortMap = {
    user: "user-name",
    state: "distributor-state",
    program: "program-name",
    orderDate: "order-date",
    dueDate: "due-date",
  };
  let statusString =
    filterObject.status !== "all"
      ? `filter[status]=${filterObject.status}`
      : "filter[status]!=approved";
  let userString = filterObject.user
    ? `&filter[user-id]=${filterObject.user}`
    : "";
  let progString =
    filterObject.program.length > 0
      ? `&filter[program-name]=${filterObject.program}`
      : "";
  let brandString = filterObject.brand
    ? `&filter[brand-id]=${filterObject.brand}`
    : "";
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `&filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let sortString = `&sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString =
    "/api/pre-orders?" +
    statusString +
    userString +
    progString +
    brandString +
    seqString +
    sortString;

  await axios
    .get(queryString)
    .then((res) => {
      console.log(res.data.meta)
      let dataObject = { orders: null, nextLink: null, orderCount: null, queryTotal: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      dataObject.orderCount = res.data.meta["total_entries"] ? res.data.meta["total_entries"] : null;
      dataObject.queryTotal = res.data.meta["total_cost"] ? res.data.meta["total_cost"] : null; 
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

export const fetchNextPreOrders = async (url) => {
  const response = { status: "", error: null, data: null };
  // let queryString = decodeURIComponent(url).split("+").join(" ")
  await axios
    .get(url)
    .then((res) => {
      let dataObject = { orders: null, nextLink: null, orderCount: null, queryTotal: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.preOrders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      dataObject.orderCount = res.data.meta["total_entries"] ? res.data.meta["total_entries"] : null;
      dataObject.queryTotal = res.data.meta["total_cost"] ? res.data.meta["total_cost"] : null;
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

export const setPreOrderNote = async (id, note) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/pre-orders/${id}`,
      {
        data: {
          type: "pre-order",
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
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

export const submitPreOrder = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/pre-orders/${id}/submit`, null, writeHeaders)
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

export const deletePreOrderItem = async (id) => {
  const response = { status: "", error: null };
  await axios
    .delete(
      `/api/pre-order-items/${id}`,
      {
        data: {
          type: "pre-order-item",
          id: id,
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

// -------------------------- Single Order Calls ------------------------- //

export const createOrder = async (type) => {
  const response = { status: "", error: null, data: null };
  let formattedType = type === "inStock" ? "in-stock" : "on-demand";
  await axios
    .post(
      "/api/orders",
      {
        data: {
          type: "order",
          attributes: {
            type: formattedType,
          },
        },
      },
      writeHeaders
    )
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      console.log(data);
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
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

export const updateOrderStatus = async (id, status) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/orders/${id}`,
      {
        data: {
          type: "order",
          id: id,
          attributes: {
            status: status,
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

export const addOrderItem = async (id, item, qty) => {
  const response = { status: "", error: null, data: null };
  await axios
    .post(
      "/api/order-items",
      {
        data: {
          type: "order-item",
          attributes: {
            qty: qty,
          },
          relationships: {
            order: {
              data: {
                type: "order",
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
      console.log(data);
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
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

export const setOrderShipping = async (orderId, distId) => {
  const response = { status: "", error: null };
  await axios
    .patch(
      `/api/orders/${orderId}`,
      {
        data: {
          type: "order",
          id: orderId,
          relationships: {
            distributor: {
              data: {
                type: "distributor",
                id: distId,
              },
            },
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
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

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
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
};

export const submitOrder = async (id) => {
  const response = { status: "", error: null };
  await axios
    .post(`/api/orders/${id}/submit`, null, writeHeaders)
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

export const fetchOrderHistory = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  const sortMap = {
    orderNum: "id",
    distributor: "distributor-name",
    state: "distributor-state",
    program: "program-name",
    orderDate: "order-date",
    shipDate: "ship-date",
    status: "order-status",
    user: "user",
  };
  let statusString = filterObject.status
    ? `filter[status]=${filterObject.status}&`
    : "filter[status]=not-draft&";
  let typeString = filterObject.type
    ? filterObject.type === "not-pre-order"
      ? `&filter[type]=not-pre-order`
      : `&filter[type]=${filterObject.type}`
    : "";
  let dateString = `filter[order-date-range]=${filterObject.fromDate} - ${filterObject.toDate}`;
  let distString = filterObject.distributor
    ? `&filter[distributor-id]=${filterObject.distributor}`
    : "";
  let brandString = filterObject.brand
    ? `&filter[brand-id]=${filterObject.brand}`
    : "";
  let progString =
    filterObject.program.length > 0
      ? `&filter[program-name]=${filterObject.program}`
      : "";
  let seqString =
    filterObject.sequenceNum.length > 0
      ? `&filter[item-number]=${filterObject.sequenceNum}`
      : "";
  let sortString = `&sort=${filterObject.sortOrder === "desc" ? "-" : ""}${
    sortMap[filterObject.sortOrderBy]
  }`;
  let queryString =
    "/api/orders?" +
    statusString +
    dateString +
    typeString +
    distString +
    brandString +
    progString +
    seqString +
    sortString;

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
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

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
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

export const fetchSingleOrder = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/orders/${id}`)
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

export const fetchSingleOrderByType = async (type, userId) => {
  const response = { status: "", error: null, data: null };
  let formattedType = type === "inStock" ? "in-stock" : "on-demand";
  await axios
    .get(
      `/api/orders?filter[user-id]=${userId}&filter[type]=${formattedType}&filter[status]=draft`
    )
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
