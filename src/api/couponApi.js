import axios from "axios";
import Jsona from "jsona";
import { encode } from 'js-base64';

const dataFormatter = new Jsona();

const instance = axios.create();
delete instance.defaults.headers.common["Authorization"];

export const getCouponUrl = async (email, url) => {
  const response = { status: "", error: null, data: null };
  const requestUrl = process.env.REACT_APP_COUPON_REQUEST_URL;
  const siteId = process.env.REACT_APP_COUPON_REQUEST_SITE_ID;
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
          "Authorization":  `Basic ${encode("GalloAPI-Prod:6326iTc8mXEDGRVUEL4y")}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Content-Type": "application/json; charset=utf-8",
          Expires: "-1",
          Server: "Microsoft-IIS/8.5",
          Accept: "*/*",
          "X-AspNet-Version": "4.0.30319",
          "Access-Control-Allow-Origin": "https://brandhub-ui-dev.onrender.com",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "HEAD,GET,POST,OPTIONS",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    )
    .then((res) => {
      console.log(res);
      response.status = "ok";
      response.data = res;
    })
    .catch((err) => {
      console.log(err.response.data.errors[0].title);
      response.status = "error";
      response.error = err.response.data.errors[0].title;
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
        console.log(data);
        polling = false;
        response.status = "ok";
        response.data = data;
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].title);
        response.status = "error";
        response.error = err.response.data.errors[0].title;
      });
  };
  await getSet();
  while (polling && !response.data) {
    await getSet();
  }
  return response;
};
