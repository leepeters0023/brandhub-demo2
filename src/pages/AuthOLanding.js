import React, { useEffect } from "react";
import { navigate } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import { getRedirect, loginWithCode } from "../redux/slices/userSlice";

import Loading from "../components/Utility/Loading";

const AuthOLanding = ({ code }) => {
  const dispatch = useDispatch()
  const link = useSelector((state) => state.user.redirectLink)
  const currentRole = useSelector((state) => state.user.role);
  console.log(link);
  
  useEffect(() => {
    if (!link && !code) {
      dispatch(getRedirect());
    }
  }, [link, code, dispatch])

  useEffect(() => {
    if (link && !code) {
      //window.open(link);
      window.location = link;
    }
  }, [link, code])

  useEffect(() => {
    if (code) {
      dispatch(loginWithCode(code))
    }
  })

  useEffect(() => {
    if (currentRole) {
      navigate("/dashboard");
    }
  }, [currentRole])

  console.log(code)

  return (
    <Loading />
  )
}

export default AuthOLanding;