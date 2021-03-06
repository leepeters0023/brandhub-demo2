import axios from "axios";
import Jsona from "jsona";
import { encode } from "js-base64";
import { handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

const instance = axios.create();
delete instance.defaults.headers.common["Authorization"];

export const getCouponUrl = async (email, url) => {
  const response = { status: "", error: null, data: null };
  const requestUrl = process.env.REACT_APP_COUPON_REQUEST_URL;
  const siteId = process.env.REACT_APP_COUPON_REQUEST_SITE_ID;
  const userNamePassword = process.env.REACT_APP_COUPON_USERNAME_PASSWORD;
  await instance
    .post(
      requestUrl,
      {
        SiteId: siteId,
        Resource: "couponCustomization",
        UserEmail: email,
        Roles: ["Coupons", "Shopper"],
        PostbackUrl: url,
      },
      {
        headers: {
          Authorization: `Basic ${encode(userNamePassword)}`,
        },
      }
    )
    .then((res) => {
      response.status = "ok";
      response.data = res.data.AccessUrl;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const getCouponOrderSet = async (code) => {
  const response = { status: "", error: "404", data: null };
  let polling = true;
  setTimeout(() => {
    polling = false;
  }, 10000);
  const pollSleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  const getSet = async () => {
    await axios
      .get(`/api/order-sets/coupon/${code}`)
      .then((res) => {
        let data = dataFormatter.deserialize(res.data);
        polling = false;
        response.status = "ok";
        response.data = data;
        response.error = null;
      })
      .catch((err) => {
        const error = handleErrors(err);
        console.log(error);
        response.status = "error";
        if (error !== "Not Found") {
          response.error = error;
        } else {
          response.error = "404";
        }
      });
  };
  await getSet();
  while (polling && !response.data && response.error === "404") {
    await getSet();
    await pollSleep(500);
  }
  if (response.error && response.error === "404") {
    response.error = "Coupon Creation Process Abandoned.  If this was deliberate, click below to go back home.  If it was not, please contact the help desk."
  }
  return response;
};
