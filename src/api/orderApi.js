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
    .get(`/api/pre_orders?filter[program_id]=${program}`)
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

export const deletePreOrderItem = async (id) => {
  const response = { status: "", error: null };
  let headers = {
    headers: {
      "Accept": "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    }
  }
  await axios
    .delete(`/api/pre_order_items/${id}`, {
      data: {
        type: "pre-order-item",
        id: id
      }
    }, headers)
    .then((res) => {
      console.log(res);
      response.status = "ok";
    })
    .catch((err) => {
      console.log(err.toString());
      response.status = "error";
      response.err = err.toString();
    });
  return response;
}