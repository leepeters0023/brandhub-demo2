import axios from "axios";
import Jsona from "jsona";

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
      response.status = "error";
      response.error = err.toString();
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
      console.log(data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      response.status = "error";
      response.error = err.toString();
    });
  return response;
};

//Removes user information from local storage on logout, and removes authenticated headers from axios
export const logoutUser = () => {
  localStorage.removeItem("brandhub-user");
  localStorage.removeItem("brandhub-role");
  delete axios.defaults.headers.common["Authorization"];
};

//Set's users info in local storage and updates axios headers on successful login
const setAuthToken = (token) => {
  const authToken = `Bearer ${token.access_token}`;
  localStorage.setItem("brandhub-user", JSON.stringify(token));
  axios.defaults.headers.common["Authorization"] = authToken;
};

export const addFavoriteItems = async (idArray) => {
  const response = { status: "", error: null, data: null }
  const ids = idArray.map((id => ({ type: "item", id: id})))
  console.log(ids)
  await axios
    .patch("/api/current-user", {
      data: {
        type: "current-user",
        relationships: {
          "favorite-items": {
            data: ids
          }
        }
      }
    }, writeHeaders)
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
}
