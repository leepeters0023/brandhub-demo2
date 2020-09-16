import axios from "axios";
import Jsona from "jsona";

const dataFormatter = new Jsona();

//mock fetch
const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fetchOrdersByProgram = async (program) => {
  const response = { status: "", error: null, data: null };
  //await timeout(1000);
  await axios
    .get(`/api/pre-orders?filter[program_id]=${program}`)
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

export const fetchAllPreOrders = async () => {
  const response = { status: "", error: null, data: null };
  await axios
  .get("/api/pre-orders")
  .then((res) => {
    let data = dataFormatter.deserialize(res.data)
    response.status = "ok"
    response.data = data
  })
  .catch((err) => {
    console.log(err.toString());
    response.status = "error";
    response.error = err.toString();
  });
return response;
}

export const patchOrderItem = async (id, qty) => {
  const response = { status: "", error: null };
  let headers = {
    headers: {
      "Accept": "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    }
  }
  //await timeout(500)
  await axios
    .patch(`/api/order-items/${id}`, {
      data: {
        type: "order-item",
        id: id,
        attributes: {
          qty: qty,
        },
      },
    }, headers)
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
//TODO
export const addOrderItem = async (id, item, qty) => {
  const response = { status: "", error: null };
  // let headers = {
  //   headers: {
  //     "Accept": "application/vnd.api+json",
  //     "Content-Type": "application/vnd.api+json"
  //   }
  // }

  await timeout(1000)
  response.status = "ok"
  return response;
}

export const setPreOrderNote = async (id, note) => {
  const response = { status: "", error: null }
  let headers = {
    headers: {
      "Accept": "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    }
  }
  await axios
    .patch(`/api/pre-orders/${id}`,
    {
      data: {
        type: "pre-order",
        id: id,
        attributes: {
          notes: note,
        },
      },
    }, headers)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
}

export const deletePreOrderItem = async (id) => {
  const response = { status: "", error: null };
  let headers = {
    headers: {
      "Accept": "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    }
  }
  await axios
    .delete(`/api/pre-order-items/${id}`, {
      data: {
        type: "pre-order-item",
        id: id
      }
    }, headers)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
}

export const submitPreOrder = async (id) => {
  const response = { status: "", error: null };
  let headers = {
    headers: {
      "Accept": "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    }
  }
  await axios
    .post(`/api/pre-orders/${id}/submit`, null, headers)
    .then((res) => {
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
}

export const fetchOrderHistory = async (filterObject) => {
  const response = {status: "", error: null, data: null };
  console.log(filterObject)
  const sortMap = {
    "orderNum": "id",
    "distributor": "distributor-name",
    "state": "distributor-state",
    "program": "program-name",
    "orderDate": "order-date",
    "shipDate": "ship-date",
    "status": "order-status",
  }
  let dateString = `filter[order-date-range]=${filterObject.fromDate} - ${filterObject.toDate}`
  let distString = filterObject.distributor ? `&filter[distributor-id]=${filterObject.distributor}` : "";
  let progString = filterObject.program.length > 0 ? `&filter[program-name]=${filterObject.program}` : "";
  let seqString = filterObject.sequenceNum.length > 0 ? `&filter[item-number]=${filterObject.sequenceNum}` : "";
  let sortString = `&sort=${filterObject.sortOrder === "desc" ? "-" : ""}${sortMap[filterObject.sortOrderBy]}`
  let queryString = "/api/orders?filter[status]=not-draft&"+dateString+distString+progString+seqString+sortString;
  
  await axios
    .get(queryString)
    .then((res) => {
      console.log(res);
      let dataObject = {orders: null, nextLink: null}
      let data = dataFormatter.deserialize(res.data)
      dataObject.orders = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null
      response.status = "ok"
      response.data = dataObject
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.error = err.toString();
    });
  return response;
}
