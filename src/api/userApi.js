import axios from "axios";

export const logInUser = async (email, password) => {
  axios.post("/auth/token", {email: email, password: password})
  .then((res) => {
    setAuthToken(res.data.token);
    return {status: "ok", error: null}
  })
  .catch((err) => {
    return {status: "error", error: err.toString()}
  })
}

export const getUser = async () => {
  axios.get("/users")
  .then((res) => {
    return {status: "ok", error: null, data: res.data}
  })
  .catch((err) => {
    return {status: "error", error: err.toString(), data: null}
  })
}

export const logoutUser = () => {
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"]
}

const setAuthToken = (token) => {
  const authToken = `Bearer ${token.access_token}`
  localStorage.setItem("user", token)
  axios.defaults.headers.common["Authorization"] = authToken
}