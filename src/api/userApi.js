import { navigate } from "@reach/router";
import axios from "axios";
import Jsona from "jsona";
import { handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

const writeHeaders = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
};

//Logs the user in based on email and password
export const logInUser = async (email, password) => {
  const response = { status: "", error: null };
  await axios
    .post(`/auth/token`, {
      grant_type: "password",
      username: email,
      password: password,
    })
    .then((res) => {
      setAuthToken(res.data);
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

//After login, headers are updated with the current user's access token
//This call will only work if the bearer token is present in the headers
export const getUser = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/current-user`)
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

export const getLoginURL = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/oauth/login_url")
    .then((res) => {
      response.status = "ok";
      response.data = res.data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const loginUserWithAuthO = async (code) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/oauth/${code}`)
    .then((res) => {
      setAuthToken(res.data);
      response.data = res.data;
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

//Removes user information from local storage on logout, and removes authenticated headers from axios
export const logoutUser = async () => {
  const redirectUrl = window.location.origin;
  localStorage.removeItem("brandhub-user");
  localStorage.removeItem("brandhub-role");
  delete axios.defaults.headers.common["Authorization"];
  navigate(
    `https://login.readytoactivate.com/v2/logout?client_id=dF47mW4gMqWUtNBHdt0JcTsNUAOPA1oG&returnTo=${redirectUrl}`
  );
};

//Set's users info in local storage and updates axios headers on successful login
const setAuthToken = (token) => {
  const authToken = `Bearer ${token.access_token}`;
  localStorage.setItem("brandhub-user", JSON.stringify(token));
  axios.defaults.headers.common["Authorization"] = authToken;
};

export const addFavoriteItems = async (idArray) => {
  const response = { status: "", error: null, data: null };
  const ids = idArray.map((id) => ({ type: "item", id: id }));
  await axios
    .patch(
      "/api/current-user",
      {
        data: {
          type: "current-user",
          relationships: {
            "favorite-items": {
              data: ids,
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

export const getFilteredUsers = async (name, role) => {
  const response = { status: "", error: null, data: null };
  let queryString =
    name.length > 0 ? `/api/users?filter[name]=${name}` : "/api/users";
  if (role && role === "super") {
    queryString += queryString.includes("?")
      ? "&filter[roles]=purchaser,select-purchaser,super"
      : "?filter[roles]=purchaser,select-purchaser,super";
  }
  if (role && role === "purchaser") {
    queryString += queryString.includes("?")
      ? "&filter[roles]=purchaser,super"
      : "?filter[roles]=purchaser,super";
  }
  if (role && role === "select-purchaser") {
    queryString += queryString.includes("?")
      ? "&filter[roles]=select-purchaser,super"
      : "?filter[roles]=select-purchaser,super";
  }
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = { users: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.users = data;
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

export const getNextFilteredUsers = async (link) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(link)
    .then((res) => {
      let dataObject = { users: null, nextLink: null };
      let data = dataFormatter.deserialize(res.data);
      dataObject.users = data;
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

export const getSingleUser = async (id) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/users/${id}`)
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

export const updateUserCreds = async (userData) => {
  const stateIds = userData.states.map((state) => ({
    type: "state",
    id: state,
  }));
  const territoryIds = userData.territories.map((terr) => ({
    type: "territory",
    id: terr,
  }));
  const response = { status: "", error: null, data: null };
  await axios
    .patch(
      `/api/users/${userData.id}`,
      {
        data: {
          type: "user",
          id: userData.id,
          attributes: {
            role: userData.role,
            name: userData.name,
            email: userData.email,
            "is-on-premise": userData.isOnPremise,
            "is-retail": userData.isRetail,
            status: "active",
          },
          relationships: {
            states: {
              data: stateIds,
            },
            territories: {
              data: territoryIds,
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
