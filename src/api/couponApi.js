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
  const response = { status: "", error: null, data: null };
  let polling = true;
  const sleep = (ms, cancelToken, cb) => {
    return new Promise((resolve, reject) => () => {
      cancelToken.cancel = () => {
        reject(new Error("sleep() cancelled"));
      };
      setTimeout(() => {
        cb();
        resolve();
      }, ms);
    });
  };
  const breakPoll = () => {
    polling = false;
  };
  const token = {};
  await sleep(10000, token, breakPoll);
  const getSet = async () => {
    await axios
      .get(`/api/coupon/order-sets/${code}`)
      .then((res) => {
        let data = dataFormatter.deserialize(res.data);
        polling = false;
        response.status = "ok";
        response.data = data;
      })
      .catch((err) => {
        const error = handleErrors(err);
        console.log(error);
        response.status = "error";
        response.error = error;
      });
  };
  await getSet();
  while (polling && !response.data) {
    await getSet();
  }
  return response;
};
