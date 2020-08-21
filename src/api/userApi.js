import axios from "axios";

export const logInUser = async (email, password) => {
  const response = {status: "", error: null}
  await axios.post(`/auth/token`, {grant_type: "password", username: email, password: password})
  .then((res) => {
    setAuthToken(res.data);
    response.status="ok"
  })
  .catch((err) => {
    response.status = "error"
    response.error = err.toString()
  })
  return response
}

export const getUser = async (id) => {
  const response = {status: "", error: null, data: null}
  await axios.get(`/api/users/${id}`)
  .then((res) => {
    response.status = "ok"
    response.data = res.data
  })
  .catch((err) => {
    response.status = "error"
    response.error = err.toString()
  })
  return response
}

export const logoutUser = () => {
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"]
}

const setAuthToken = (token) => {
  const authToken = `Bearer ${token.access_token}`
  localStorage.setItem("user", JSON.stringify(token))
  axios.defaults.headers.common["Authorization"] = authToken
}